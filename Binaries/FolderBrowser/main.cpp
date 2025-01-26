#include <windows.h>
#include <shlobj.h> // Required for SHBrowseForFolder
#include <iostream>
#include <string>

// Function to open a folder picker dialog using SHBrowseForFolder
std::wstring OpenFolderDialogXP() {
	wchar_t folderPath[MAX_PATH] = L""; // Wide-character buffer for the folder path

										// Initialize BROWSEINFO structure
	BROWSEINFOW bi = { 0 }; // Use the wide version of BROWSEINFO
	bi.lpszTitle = L"Select a folder:"; // Wide-character string for the dialog title
	bi.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE; // New dialog style is optional

															// Show the folder picker dialog
	LPITEMIDLIST pItemIdList = SHBrowseForFolderW(&bi); // Use the wide version of SHBrowseForFolder
	if (pItemIdList != nullptr) {
		// Get the folder path
		if (SHGetPathFromIDListW(pItemIdList, folderPath)) { // Use the wide version of SHGetPathFromIDList
			CoTaskMemFree(pItemIdList); // Free memory allocated for pItemIdList
			return std::wstring(folderPath); // Return the selected folder path as a std::wstring
		}
		else {
			std::wcerr << L"Failed to get folder path." << std::endl;
		}
		CoTaskMemFree(pItemIdList);
	}
	else {
		std::wcerr << L"Folder selection canceled." << std::endl;
	}

	return L""; // Return an empty string if no folder was selected
}


// Entry point for console application
int main(int argc, char* argv[]) {
	std::wstring selectedFolder = OpenFolderDialogXP();
	if (!selectedFolder.empty()) {
		std::wcout << L"Selected folder: " << selectedFolder << std::endl;
	}
	else {
		std::wcout << L"Folder selection failed or canceled." << std::endl;
	}
	return 0;
}

int CALLBACK WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
	int argc = __argc;       // Get command-line argument count
	char** argv = __argv;    // Get command-line arguments
	return main(argc, argv); // Forward to main()
}
