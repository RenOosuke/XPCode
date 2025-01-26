#define _CRT_SECURE_NO_WARNINGS
#include <ShlObj.h>  // For CFSTR_PREFERREDDROPEFFECT and related constants
#pragma comment(lib, "Shlwapi.lib")
#pragma comment(lib, "Gdiplus.lib")
#include <Gdiplus.h>
#include <Shlwapi.h>  // For PathFileExist
#include <windows.h>
#include <string>
#include <vector>
#include <iostream>
#include <shlobj.h>  // For CF_HDROP (file list) clipboard format
#include <tchar.h>
#include <locale>
#include <codecvt>
#include <sstream> // For std::wstringstream

struct ClipboardContent {
	std::string type;
	std::vector<std::string> items;
};

ULONG_PTR gdiplusToken;
void InitializeGDIPlus() {
	Gdiplus::GdiplusStartupInput gdiplusStartupInput;
	Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, nullptr);
}

// Shutdown GDI+
void ShutdownGDIPlus() {
	Gdiplus::GdiplusShutdown(gdiplusToken);
}


// Helper function to convert wide string to narrow string
std::string WStringToString(const std::wstring& wstr) {
	int bufferSize = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, nullptr, 0, nullptr, nullptr);
	std::string str(bufferSize, 0);
	WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, &str[0], bufferSize, nullptr, nullptr);
	return str;
}

std::wstring StringToWString(const std::string& str) {
	std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
	return converter.from_bytes(str);
}

std::vector<std::string> WStringVectorToStringVector(const std::vector<std::wstring>& wstrVec) {
	std::vector<std::string> strVec;
	for (const auto& wstr : wstrVec) {
		strVec.push_back(WStringToString(wstr));  // Assuming WStringToString() is implemented
	}
	return strVec;
}

ClipboardContent CheckClipboardContents() {
	ClipboardContent content;
	content.type = "none";

	if (!OpenClipboard(nullptr)) {
		std::cerr << "Failed to open clipboard" << std::endl;
		return content;
	}

	if (IsClipboardFormatAvailable(CF_TEXT)) {
		content.type = "text";
		HANDLE hData = GetClipboardData(CF_TEXT);
		if (hData != nullptr) {
			char* pszText = static_cast<char*>(GlobalLock(hData));
			if (pszText != nullptr) {
				content.items.push_back(pszText);
				GlobalUnlock(hData);
			}
		}
	}
	else if (IsClipboardFormatAvailable(CF_HDROP)) {
		content.type = "file";
		HANDLE hData = GetClipboardData(CF_HDROP);
		if (hData != nullptr) {
			HDROP hDrop = static_cast<HDROP>(hData);
			UINT fileCount = DragQueryFile(hDrop, 0xFFFFFFFF, nullptr, 0);
			for (UINT i = 0; i < fileCount; i++) {
				wchar_t filePath[MAX_PATH];
				DragQueryFile(hDrop, i, filePath, MAX_PATH);
				content.items.push_back(WStringToString(filePath));
			}
			DragFinish(hDrop);
		}
	}
	else if (IsClipboardFormatAvailable(CF_BITMAP)) {
		content.type = "image";
		content.items.push_back("Image data present");  // Placeholder for image metadata
	}

	CloseClipboard();
	return content;
}

void CopyTextToClipboard(const std::string& text) {
	if (!OpenClipboard(nullptr)) return;
	EmptyClipboard();

	HGLOBAL hText = GlobalAlloc(GMEM_MOVEABLE, text.size() + 1);
	if (hText) {
		char* pText = static_cast<char*>(GlobalLock(hText));
		memcpy(pText, text.c_str(), text.size() + 1);
		GlobalUnlock(hText);
		SetClipboardData(CF_TEXT, hText);
	}

	CloseClipboard();
}

void CopyFilesToClipboard(const std::vector<std::wstring>& filePaths, bool isCut = false) {
	if (!OpenClipboard(nullptr)) return;
	EmptyClipboard();

	// Calculate the total size for the DROPFILES structure and file paths
	size_t totalSize = sizeof(DROPFILES);
	for (const auto& filePath : filePaths) {
		totalSize += (filePath.size() + 1) * sizeof(wchar_t); // Account for each wchar_t
	}
	totalSize += sizeof(wchar_t); // Double null terminator

	HGLOBAL hDrop = GlobalAlloc(GHND, totalSize);
	if (hDrop) {
		DROPFILES* pDrop = static_cast<DROPFILES*>(GlobalLock(hDrop));
		pDrop->pFiles = sizeof(DROPFILES);
		pDrop->fWide = TRUE; // Use wide characters

		wchar_t* pData = reinterpret_cast<wchar_t*>(reinterpret_cast<char*>(pDrop) + sizeof(DROPFILES));
		for (const auto& filePath : filePaths) {
			wcscpy(pData, filePath.c_str());
			pData += filePath.size() + 1;
		}
		*pData = L'\0'; // Double null terminator

		GlobalUnlock(hDrop);
		SetClipboardData(CF_HDROP, hDrop);
	}

	// If this is a cut operation, set the preferred drop effect to "move"
	if (isCut) {
		HGLOBAL hEffect = GlobalAlloc(GMEM_MOVEABLE, sizeof(DWORD));
		if (hEffect) {
			DWORD* pEffect = static_cast<DWORD*>(GlobalLock(hEffect));
			*pEffect = DROPEFFECT_MOVE; // DROPEFFECT_MOVE indicates a cut operation
			GlobalUnlock(hEffect);
			SetClipboardData(RegisterClipboardFormat(CFSTR_PREFERREDDROPEFFECT), hEffect);
		}
	}

	CloseClipboard();
}

void CopyImageToClipboard(HBITMAP hBitmap) {
	if (!OpenClipboard(nullptr)) return;
	EmptyClipboard();
	SetClipboardData(CF_BITMAP, hBitmap);
	CloseClipboard();
}

void ClearClipboard() {
	if (OpenClipboard(nullptr)) {
		EmptyClipboard();
		CloseClipboard();
	}
}

bool IsClipboardEmpty() {
	if (!OpenClipboard(nullptr)) return true;
	bool empty = !IsClipboardFormatAvailable(CF_TEXT) &&
		!IsClipboardFormatAvailable(CF_HDROP) &&
		!IsClipboardFormatAvailable(CF_BITMAP);
	CloseClipboard();
	return empty;
}

std::wstring GenerateUniqueFilename(const std::wstring& directory, const std::wstring& filename, const std::wstring& extension) {
	// Start with "filename - Copy"
	std::wstring baseFilename = filename + L" - Copy";
	std::wstring newPath = directory + L"\\" + baseFilename + extension;
	int attempt = 1;

	// Check if the file already exists
	while (GetFileAttributes(newPath.c_str()) != INVALID_FILE_ATTRIBUTES) { // File exists
																			// If it exists, generate a new path with "(attempt)" appended
		newPath = directory + L"\\" + baseFilename + L" (" + std::to_wstring(attempt) + L")" + extension;
		++attempt;
	}

	return newPath;
}

std::wstring GenerateUniqueFilenameSafely(const std::wstring& directory, const std::wstring& fullFileName) {
	size_t lastDot = fullFileName.find_last_of(L".");
	std::wstring name = (lastDot == std::wstring::npos) ? fullFileName : fullFileName.substr(0, lastDot);
	std::wstring extension = (lastDot == std::wstring::npos) ? L"" : fullFileName.substr(lastDot);

	return GenerateUniqueFilename(directory, name, extension);
}

std::wstring GenerateUniqueFolderName(const std::wstring& directory, const std::wstring& folderName) {
	std::wstring newFolderName = directory + L"\\" + folderName;
	int attempt = 1;

	// Check if the folder already exists
	while (PathFileExists(newFolderName.c_str())) {
		newFolderName = directory + L"\\" + folderName + L" - Copy";
		if (attempt > 1) {
			newFolderName += L" (" + std::to_wstring(attempt) + L")";
		}
		attempt++;
	}

	return newFolderName;
}


bool CopyFileToTarget(const std::wstring& sourcePath, const std::wstring& targetPath) {
	if (CopyFile(sourcePath.c_str(), targetPath.c_str(), FALSE)) {
		return true;
	}
	else {
		std::wcerr << L"Failed to copy file: " << sourcePath << L" to " << targetPath << L" Error: " << GetLastError() << std::endl;
		return false;
	}
}

bool SaveClipboardImageToFile(const std::wstring& directory) {
	if (!OpenClipboard(nullptr)) {
		std::wcerr << L"Failed to open clipboard." << std::endl;
		return false;
	}

	if (!IsClipboardFormatAvailable(CF_BITMAP)) {
		std::wcerr << L"No image in clipboard to save." << std::endl;
		CloseClipboard();
		return false;
	}

	HBITMAP hBitmap = static_cast<HBITMAP>(GetClipboardData(CF_BITMAP));
	if (!hBitmap) {
		std::wcerr << L"Failed to get image from clipboard." << std::endl;
		CloseClipboard();
		return false;
	}

	// Convert HBITMAP to GDI+ Bitmap for saving
	Gdiplus::Bitmap bitmap(hBitmap, nullptr);
	CloseClipboard();

	// Generate a unique file name
	std::wstring filePath = GenerateUniqueFilename(directory, L"New Clipboard Image", L".png");

	// Save the image as a PNG file
	CLSID pngClsid;
	CLSIDFromString(L"{557CF406-1A04-11D3-9A73-0000F81EF32E}", &pngClsid);
	Gdiplus::Status status = bitmap.Save(filePath.c_str(), &pngClsid, nullptr);

	if (status == Gdiplus::Ok) {
		std::wcout << L"Image saved to " << filePath << std::endl;
		return true;
	}
	else {
		std::wcerr << L"Failed to save image." << std::endl;
		return false;
	}
}

std::vector<std::wstring> GetFilesFromClipboard() {
	std::vector<std::wstring> filePaths;

	if (!OpenClipboard(nullptr)) {
		std::cerr << "Failed to open clipboard." << std::endl;
		return filePaths;
	}

	if (IsClipboardFormatAvailable(CF_HDROP)) {
		HANDLE hData = GetClipboardData(CF_HDROP);
		if (hData != nullptr) {
			HDROP hDrop = static_cast<HDROP>(hData);
			UINT fileCount = DragQueryFile(hDrop, 0xFFFFFFFF, nullptr, 0);
			for (UINT i = 0; i < fileCount; i++) {
				wchar_t filePath[MAX_PATH];
				DragQueryFile(hDrop, i, filePath, MAX_PATH);
				filePaths.push_back(filePath);
			}
			DragFinish(hDrop);
		}
	}

	CloseClipboard();
	return filePaths;
}

bool CopyItemToTarget(const std::wstring& sourcePath, const std::wstring& targetPath, bool isCut) {
	SHFILEOPSTRUCT fileOp = { 0 };
	fileOp.wFunc = isCut ? FO_MOVE : FO_COPY;
	fileOp.fFlags = FOF_NOCONFIRMATION | FOF_NOCONFIRMMKDIR | FOF_SILENT;

	// Source and destination need double-null termination for SHFileOperation
	std::wstring source = sourcePath + L'\0';
	std::wstring destination = targetPath + L'\0';

	fileOp.pFrom = source.c_str();
	fileOp.pTo = destination.c_str();

	int result = SHFileOperation(&fileOp);
	return (result == 0); // Returns 0 if successful
}

void PasteFilesFromClipboard(const std::wstring& targetDirectory, bool isCut = false) {
	std::vector<std::wstring> items = GetFilesFromClipboard();
	if (items.empty()) {
		std::wcout << L"No items in clipboard to paste." << std::endl;
		return;
	}

	for (const auto& itemPath : items) {
		std::wstring itemName = itemPath.substr(itemPath.find_last_of(L"\\") + 1);
		std::wstring targetPath = targetDirectory + L"\\" + itemName;

		// Determine if the item is a directory
		DWORD attributes = GetFileAttributes(itemPath.c_str());
		bool isDirectory = (attributes != INVALID_FILE_ATTRIBUTES && (attributes & FILE_ATTRIBUTE_DIRECTORY));

		// Generate a unique name for folders and files if there's a conflict
		if (GetFileAttributes(targetPath.c_str()) != INVALID_FILE_ATTRIBUTES) {
			if (isDirectory) {
				targetPath = GenerateUniqueFolderName(targetDirectory, itemName); // For folders
			}
			else {
				size_t lastDot = itemName.find_last_of(L".");
				std::wstring name;
				std::wstring extension;

				// Handle trailing dots and missing extensions
				if (lastDot == std::wstring::npos || lastDot == itemName.size() - 1) {
					// No extension or trailing dot (e.g., "example" or "example.")
					name = itemName;
					extension = L"";
				}
				else {
					// Regular case with a valid extension
					name = itemName.substr(0, lastDot);
					extension = itemName.substr(lastDot);
				}

				targetPath = GenerateUniqueFilename(targetDirectory, name, extension); // For files
			}
		}

		// Copy or move the item to the target path
		if (CopyItemToTarget(itemPath, targetPath, isCut)) {
			std::wcout << (isCut ? L"Moved" : L"Copied") << L" item to " << targetPath << std::endl;
		}
		else {
			std::wcerr << L"Failed to " << (isCut ? L"move" : L"copy") << L" item: " << itemPath << std::endl;
		}
	}
}


bool IsCutOperation() {
	bool isCut = false;

	if (OpenClipboard(nullptr)) {
		UINT format = RegisterClipboardFormat(CFSTR_PREFERREDDROPEFFECT);
		HANDLE hData = GetClipboardData(format);

		if (hData != nullptr) {
			DWORD* pEffect = static_cast<DWORD*>(GlobalLock(hData));
			if (pEffect != nullptr) {
				isCut = (*pEffect == DROPEFFECT_MOVE);
				GlobalUnlock(hData);
			}
		}
		CloseClipboard();
	}
	return isCut;
}

std::string GetClipboardText() {
	std::string text;
	if (OpenClipboard(nullptr)) {
		HANDLE hData = GetClipboardData(CF_TEXT);
		if (hData) {
			char* pText = static_cast<char*>(GlobalLock(hData));
			if (pText) {
				text = pText;
				GlobalUnlock(hData);
			}
		}
		CloseClipboard();
	}
	return text;
}

void CheckClipboard() {
	ClipboardContent content = CheckClipboardContents();  // Assuming CheckClipboardContents() is implemented

	std::wcout << L"Clipboard Type: " << StringToWString(content.type) << std::endl;
	for (const auto& item : content.items) {
		std::wcout << StringToWString(item) << std::endl;
	}
}

// Function to copy text to clipboard
void CopyTextToClipboard(const std::string& text);
void CopyFilesToClipboard(const std::vector<std::string>& filePaths, bool isCut);
void CopyImageToClipboard(HBITMAP hBitmap);

// Wrapper function for copying text to clipboard
void CopyToClipboard(const std::wstring& content) {
	std::string narrowContent = WStringToString(content); // Convert to narrow string
	CopyTextToClipboard(narrowContent); // Text-only function
}

std::vector<std::wstring> ParseFileList(const std::wstring& fileList) {
	std::vector<std::wstring> files;
	std::wstring delimiter = L"::";
	size_t pos = 0;
	std::wstring remainingList = fileList; // Use a copy to avoid modifying the original

	while ((pos = remainingList.find(delimiter)) != std::wstring::npos) {
		std::wstring file = remainingList.substr(0, pos);
		files.push_back(file);
		remainingList.erase(0, pos + delimiter.length());
	}
	files.push_back(remainingList); // Add the last part after the last "::" delimiter
	return files;
}

int _tmain(int argc, _TCHAR* argv[]) {
	std::wstring command;
	while (std::getline(std::wcin, command)) {
		if (command == L"check") {
			CheckClipboard();
			std::wcout << L"___end___" << std::endl; // Marker for end of check command
		}
		else if (command.rfind(L"copy_text ", 0) == 0) {
			CopyToClipboard(command.substr(10)); // Calls text-only CopyToClipboard
			std::wcout << L"___end___" << std::endl; // Marker for end of copy_text command
		}
		else if (command.rfind(L"copy_files ", 0) == 0) {
			std::wstring fileList = command.substr(11);
			std::vector<std::wstring> files = ParseFileList(fileList);
			CopyFilesToClipboard(files, false);
			std::wcout << L"___end___" << std::endl; // Marker for end of copy_files command
		}
		else if (command.rfind(L"cut_files ", 0) == 0) {
			std::wstring fileList = command.substr(10);
			std::vector<std::wstring> files = ParseFileList(fileList);
			CopyFilesToClipboard(files, true);  // Pass the wstring vector directly
			std::wcout << L"___end___" << std::endl; // Marker for end of cut_files command
		}
		else if (command.rfind(L"copy_image", 0) == 0) {
			// Placeholder for image copy functionality (not implemented)
			std::wcout << L"___end___" << std::endl; // Marker for end of copy_image command
		}
		else if (command.rfind(L"file_from_image ", 0) == 0) {
			InitializeGDIPlus();
			SaveClipboardImageToFile(command.substr(16));
			ShutdownGDIPlus();
			std::wcout << L"___end___" << std::endl; // Marker for end of file_from_image command
		}
		else if (command.rfind(L"paste_files ", 0) == 0) {
			std::wstring targetDirectory = command.substr(12);
			bool isCutOperation = IsCutOperation();
			PasteFilesFromClipboard(targetDirectory, isCutOperation);
			std::wcout << L"___end___" << std::endl; // Marker for end of paste_files command
		}
		else if (command == L"exit") {
			std::wcout << L"Exiting program." << std::endl;
			std::wcout << L"___end___" << std::endl; // Marker for end of exit command
			break;
		}
		else {
			std::wcerr << L"Unknown command: " << command << std::endl;
			std::wcout << L"___end___" << std::endl; // Marker for end of unknown command
		}
	}
	return 0;
}
