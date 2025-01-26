#include <windows.h>      // Base Windows API
#include <shlobj.h>       // IShellExtInit and IContextMenu
#include <strsafe.h>      // Safe string handling
#include <objbase.h>      // COM base definitions

// Define Windows XP compatibility
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0501
#endif
#ifndef _WIN32_IE
#define _WIN32_IE 0x0501
#endif

// Global DLL instance
HINSTANCE g_hInstance = nullptr;

// CLSID for Shell Extension
const CLSID CLSID_ContextMenuHandler =
{ 0x0865980F, 0x3A31, 0x4FCC,{ 0xB5, 0x5D, 0x78, 0x44, 0xC8, 0x30, 0x29, 0xF6 } };

// IShellExtInit and IContextMenu Implementation
class CShellExtInit : public IShellExtInit, public IContextMenu {
	ULONG m_refCount;
	WCHAR m_szTarget[MAX_PATH]; // Add this member to store the path

public:
	CShellExtInit() : m_refCount(1) {}

	// IUnknown Methods
	STDMETHODIMP QueryInterface(REFIID riid, void** ppv) {
		if (riid == IID_IUnknown || riid == IID_IShellExtInit) {
			*ppv = static_cast<IShellExtInit*>(this);
		}
		else if (riid == IID_IContextMenu) {
			*ppv = static_cast<IContextMenu*>(this);
		}
		else {
			*ppv = nullptr;
			return E_NOINTERFACE;
		}
		AddRef();
		return S_OK;
	}

	STDMETHODIMP_(ULONG) AddRef() {
		return InterlockedIncrement(&m_refCount);
	}

	STDMETHODIMP_(ULONG) Release() {
		ULONG ref = InterlockedDecrement(&m_refCount);
		if (ref == 0) delete this;
		return ref;
	}

	// IShellExtInit Method
	STDMETHODIMP Initialize(LPCITEMIDLIST pidlFolder, IDataObject* pDataObj, HKEY hkeyProgID) {
		// Retrieve the path of the selected folder or file
		if (pidlFolder) {
			SHGetPathFromIDListW(pidlFolder, m_szTarget);
		}
		else if (pDataObj) {
			FORMATETC fmt = { CF_HDROP, NULL, DVASPECT_CONTENT, -1, TYMED_HGLOBAL };
			STGMEDIUM stg = { 0 };

			if (SUCCEEDED(pDataObj->GetData(&fmt, &stg))) {
				HDROP hDrop = (HDROP)stg.hGlobal;
				DragQueryFileW(hDrop, 0, m_szTarget, ARRAYSIZE(m_szTarget));
				ReleaseStgMedium(&stg);
			}
		}
		return S_OK;
	}

	HBITMAP CreateBitmapFromIcon(HICON hIcon) {
		const int iconWidth = 16;
		const int iconHeight = 16;
		const int paddedWidth = 24; // Add padding (e.g., 8px) to the right

		HDC hdcScreen = GetDC(nullptr); // Get the screen device context
		HDC hdcMemory = CreateCompatibleDC(hdcScreen);

		BITMAPINFO bmi = { 0 };
		bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
		bmi.bmiHeader.biWidth = paddedWidth; // Width with padding
		bmi.bmiHeader.biHeight = -iconHeight; // Negative height for top-down bitmap
		bmi.bmiHeader.biPlanes = 1;
		bmi.bmiHeader.biBitCount = 32; // 32 bits for transparency
		bmi.bmiHeader.biCompression = BI_RGB;

		void* pBits;
		HBITMAP hBitmap = CreateDIBSection(hdcScreen, &bmi, DIB_RGB_COLORS, &pBits, nullptr, 0);
		if (!hBitmap) {
			DeleteDC(hdcMemory);
			ReleaseDC(nullptr, hdcScreen);
			return nullptr;
		}

		HGDIOBJ hOldBitmap = SelectObject(hdcMemory, hBitmap);

		// Fill the entire bitmap with transparency
		RECT rect = { 0, 0, paddedWidth, iconHeight };
		HBRUSH hBrush = CreateSolidBrush(RGB(255, 255, 255));
		FillRect(hdcMemory, &rect, hBrush);
		DeleteObject(hBrush);

		// Draw the icon on the left side (16x16 area)
		DrawIconEx(hdcMemory, 0, 0, hIcon, iconWidth, iconHeight, 0, nullptr, DI_NORMAL);

		// Clean up
		SelectObject(hdcMemory, hOldBitmap);
		DeleteDC(hdcMemory);
		ReleaseDC(nullptr, hdcScreen);

		return hBitmap;
	}

	HICON LoadIconFromFile() {
		// Buffer to store the path of the DLL
		wchar_t dllPath[MAX_PATH] = { 0 };

		// Get the full path of the DLL
		if (!GetModuleFileNameW(g_hInstance, dllPath, MAX_PATH)) {
			MessageBoxW(nullptr, L"Failed to get DLL path.", L"Error", MB_ICONERROR);
			return nullptr;
		}

		// Remove the file name to get the directory
		wchar_t* lastSlash = wcsrchr(dllPath, L'\\');
		if (lastSlash) {
			*lastSlash = L'\0'; // Truncate to keep only the directory
		}

		// Append the icon file name to the directory
		wchar_t iconFile[MAX_PATH];
		StringCchPrintfW(iconFile, MAX_PATH, L"%s\\xpcode.ico", dllPath);

		// Load the icon from the constructed path
		HICON hIcon = (HICON)LoadImageW(
			nullptr,             // hInstance (not needed for a file)
			iconFile,            // Full path to the icon file
			IMAGE_ICON,          // Load as an icon
			16,                  // Desired width
			16,                  // Desired height
			LR_LOADFROMFILE | LR_DEFAULTCOLOR // Load from file and use default colors
		);

		if (!hIcon) {
			// Handle errors if the icon couldn't be loaded
			MessageBoxW(nullptr, L"Failed to load icon from DLL directory.", L"Error", MB_ICONERROR);
		}

		return hIcon;
	}

	// IContextMenu Methods
	STDMETHODIMP QueryContextMenu(HMENU hMenu, UINT indexMenu, UINT idCmdFirst, UINT idCmdLast, UINT uFlags) {
		// Add a menu item
		MENUITEMINFOW mii = { sizeof(MENUITEMINFOW) };
		mii.fMask = MIIM_ID | MIIM_STRING | MIIM_BITMAP;
		mii.wID = idCmdFirst;
		mii.dwTypeData = L"Open with XPCode";

		// Load the icon and convert it to a bitmap
		HICON hIcon = LoadIconFromFile();
		if (hIcon) {
			HBITMAP hBitmap = CreateBitmapFromIcon(hIcon);
			if (hBitmap) {
				mii.hbmpItem = hBitmap; // Assign the bitmap to the menu item
			}
			else {
				mii.hbmpItem = HBMMENU_CALLBACK; // Fallback if bitmap creation fails
			}
			DestroyIcon(hIcon); // Clean up the HICON object
		}
		else {
			mii.hbmpItem = HBMMENU_CALLBACK; // Fallback if icon loading fails
		}

		// Insert the menu item with the icon
		InsertMenuItemW(hMenu, indexMenu, TRUE, &mii);

		// Return the number of menu items added
		return MAKE_HRESULT(SEVERITY_SUCCESS, 0, 1);
	}

	STDMETHODIMP CShellExtInit::InvokeCommand(LPCMINVOKECOMMANDINFO pici) {
		if (HIWORD(pici->lpVerb) != 0) {
			return E_FAIL; // Not our command
		}

		// Resolve %XPCODE% environment variable
		WCHAR basePath[MAX_PATH];
		if (!ExpandEnvironmentStringsW(L"%XPCODE%", basePath, ARRAYSIZE(basePath))) {
			MessageBoxW(nullptr, L"Failed to resolve %XPCODE% environment variable.", L"Error", MB_ICONERROR);
			return E_FAIL;
		}

		// Append the executable name and arguments to the resolved base path
		WCHAR exePath[MAX_PATH];
		StringCchPrintfW(exePath, ARRAYSIZE(exePath), L"%s\\xpcode.exe", basePath);

		// Build the full argument string with the --user-data-dir parameter
		WCHAR fullArgs[MAX_PATH * 2]; // Double the size for target and parameters
		StringCchPrintfW(fullArgs, ARRAYSIZE(fullArgs), L"--user-data-dir=\"./XPCode\" \"%s\"", m_szTarget);

		// Execute the target executable with the specified arguments
		HINSTANCE result = ShellExecuteW(
			nullptr,          // Parent window handle
			L"open",          // Operation to perform
			exePath,          // Path to the .exe
			fullArgs,         // Full command-line arguments
			nullptr,          // Default working directory
			SW_SHOWNORMAL     // Window visibility
		);

		if ((INT_PTR)result <= 32) {
			// Debug message: Show the resolved executable and arguments
			WCHAR debugMessage[MAX_PATH + 512];
			StringCchPrintfW(debugMessage, ARRAYSIZE(debugMessage), L"Failed to execute command:\nExecutable: %s\nArguments: %s", exePath, fullArgs);
			MessageBoxW(nullptr, debugMessage, L"Debug: Command Execution Failed", MB_ICONERROR);

			return E_FAIL;
		}

		return S_OK;
	}

	STDMETHODIMP GetCommandString(UINT_PTR idCmd, UINT uFlags, UINT* pwReserved, LPSTR pszName, UINT cchMax) {
		return S_OK; // No implementation needed for this example
	}
};

// DLL Entry Points
STDAPI DllCanUnloadNow() {
	return S_OK;
}

class ClassFactory : public IClassFactory {
public:
	STDMETHODIMP QueryInterface(REFIID riid, void** ppv) {
		if (riid == IID_IUnknown || riid == IID_IClassFactory) {
			*ppv = static_cast<IClassFactory*>(this);
			AddRef();
			return S_OK;
		}
		return E_NOINTERFACE;
	}

	STDMETHODIMP_(ULONG) AddRef() {
		return 2; // Static class, no reference counting
	}

	STDMETHODIMP_(ULONG) Release() {
		return 1; // Static class, no reference counting
	}

	STDMETHODIMP CreateInstance(IUnknown* pUnkOuter, REFIID riid, void** ppv) {
		if (pUnkOuter != nullptr) return CLASS_E_NOAGGREGATION;

		auto* ext = new CShellExtInit();
		if (!ext) return E_OUTOFMEMORY;

		HRESULT hr = ext->QueryInterface(riid, ppv);
		ext->Release(); // Caller owns the reference now
		return hr;
	}

	STDMETHODIMP LockServer(BOOL fLock) {
		return S_OK;
	}
};

static ClassFactory g_ClassFactory;

STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, void** ppv) {
	if (rclsid == CLSID_ContextMenuHandler) {
		return g_ClassFactory.QueryInterface(riid, ppv);
	}
	return CLASS_E_CLASSNOTAVAILABLE;
}

STDAPI DllRegisterServer() {
	wchar_t modulePath[MAX_PATH];
	GetModuleFileNameW(g_hInstance, modulePath, ARRAYSIZE(modulePath));

	// Register CLSID
	HKEY hKey;
	if (RegCreateKeyW(HKEY_CLASSES_ROOT, L"CLSID\\{0865980F-3A31-4FCC-B55D-7844C83029F6}\\InprocServer32", &hKey) == ERROR_SUCCESS) {
		RegSetValueExW(hKey, nullptr, 0, REG_SZ, (BYTE*)modulePath, (DWORD)((wcslen(modulePath) + 1) * sizeof(wchar_t)));
		RegSetValueExW(hKey, L"ThreadingModel", 0, REG_SZ, (BYTE*)L"Apartment", (DWORD)(sizeof(L"Apartment")));
		RegCloseKey(hKey);
	}

	// Register context menu handler for files
	if (RegCreateKeyW(HKEY_CLASSES_ROOT, L"*\\shellex\\ContextMenuHandlers\\MyHandler", &hKey) == ERROR_SUCCESS) {
		RegSetValueExW(hKey, nullptr, 0, REG_SZ, (BYTE*)L"{0865980F-3A31-4FCC-B55D-7844C83029F6}", (DWORD)(sizeof(L"{0865980F-3A31-4FCC-B55D-7844C83029F6}")));
		RegCloseKey(hKey);
	}

	// Register context menu handler for folders
	if (RegCreateKeyW(HKEY_CLASSES_ROOT, L"Folder\\shellex\\ContextMenuHandlers\\MyHandler", &hKey) == ERROR_SUCCESS) {
		RegSetValueExW(hKey, nullptr, 0, REG_SZ, (BYTE*)L"{0865980F-3A31-4FCC-B55D-7844C83029F6}", (DWORD)(sizeof(L"{0865980F-3A31-4FCC-B55D-7844C83029F6}")));
		RegCloseKey(hKey);
	}

	// Register context menu handler for directory background
	if (RegCreateKeyW(HKEY_CLASSES_ROOT, L"Directory\\Background\\shellex\\ContextMenuHandlers\\MyHandler", &hKey) == ERROR_SUCCESS) {
		RegSetValueExW(hKey, nullptr, 0, REG_SZ, (BYTE*)L"{0865980F-3A31-4FCC-B55D-7844C83029F6}", (DWORD)(sizeof(L"{0865980F-3A31-4FCC-B55D-7844C83029F6}")));
		RegCloseKey(hKey);
	}

	return S_OK;
}

LONG RegDeleteTreeRecursive(HKEY hKeyParent, LPCWSTR subKey) {
	HKEY hKey;
	LONG lResult = RegOpenKeyExW(hKeyParent, subKey, 0, KEY_READ | KEY_WRITE, &hKey);

	if (lResult != ERROR_SUCCESS) {
		return lResult; // Key could not be opened
	}

	WCHAR keyName[MAX_PATH];
	DWORD keyNameSize;
	FILETIME ft;

	// Enumerate and delete all subkeys
	while (true) {
		keyNameSize = ARRAYSIZE(keyName);
		lResult = RegEnumKeyExW(hKey, 0, keyName, &keyNameSize, NULL, NULL, NULL, &ft);

		if (lResult == ERROR_NO_MORE_ITEMS) {
			break; // No more subkeys
		}

		if (lResult != ERROR_SUCCESS) {
			RegCloseKey(hKey);
			return lResult; // Failed to enumerate subkeys
		}

		// Recursively delete the subkey
		lResult = RegDeleteTreeRecursive(hKey, keyName);
		if (lResult != ERROR_SUCCESS) {
			RegCloseKey(hKey);
			return lResult; // Failed to delete subkey
		}
	}

	// Close and delete the current key
	RegCloseKey(hKey);
	return RegDeleteKeyW(hKeyParent, subKey);
}

STDAPI DllUnregisterServer() {
	RegDeleteTreeRecursive(HKEY_CLASSES_ROOT, L"CLSID\\{0865980F-3A31-4FCC-B55D-7844C83029F6}");
	RegDeleteTreeRecursive(HKEY_CLASSES_ROOT, L"*\\shellex\\ContextMenuHandlers\\MyHandler");
	RegDeleteTreeRecursive(HKEY_CLASSES_ROOT, L"Folder\\shellex\\ContextMenuHandlers\\MyHandler");
	RegDeleteTreeRecursive(HKEY_CLASSES_ROOT, L"Directory\\Background\\shellex\\ContextMenuHandlers\\MyHandler");
	return S_OK;
}

BOOL APIENTRY DllMain(HINSTANCE hInstance, DWORD reason, LPVOID reserved) {
	if (reason == DLL_PROCESS_ATTACH) {
		g_hInstance = hInstance;
	}
	return TRUE;
}
