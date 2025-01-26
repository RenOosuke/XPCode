#include "stdafx.h"
#include <windows.h>
#include <iostream>
#include <string>
#include <unordered_map>
#include <stack>

std::unordered_map<std::wstring, bool> pathTypeCache;

bool IsDirectory(const std::wstring& path) {
	DWORD attributes = GetFileAttributes(path.c_str());
	return (attributes != INVALID_FILE_ATTRIBUTES) && (attributes & FILE_ATTRIBUTE_DIRECTORY);
}

// Non-recursive scan function to log all existing files and directories as "created"
void LogExistingPaths(const std::wstring& rootDirectory) {
	std::stack<std::wstring> directoriesToProcess;
	directoriesToProcess.push(rootDirectory);

	while (!directoriesToProcess.empty()) {
		std::wstring directory = directoriesToProcess.top();
		directoriesToProcess.pop();

		// Log the directory creation event before listing its contents
		std::wcout << L"Directory created: " << directory << std::endl;
		std::wcout.flush();

		WIN32_FIND_DATA findData;
		HANDLE hFind = FindFirstFile((directory + L"\\*").c_str(), &findData);

		if (hFind == INVALID_HANDLE_VALUE) {
			std::wcerr << L"Error: Could not open directory for initial scan." << std::endl;
			continue;
		}

		do {
			std::wstring itemName = findData.cFileName;
			if (itemName == L"." || itemName == L"..") continue; // Skip "." and ".." entries

			std::wstring fullPath = directory + L"\\" + itemName;
			bool isDir = (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;

			// Cache the path type
			pathTypeCache[fullPath] = isDir;

			if (isDir) {
				directoriesToProcess.push(fullPath); // Add directory to stack to process later
			}
			else {
				std::wcout << L"File created: " << fullPath << std::endl;
				std::wcout.flush(); // Ensure immediate output for files
			}

		} while (FindNextFile(hFind, &findData) != 0);

		FindClose(hFind);
	}
}

// Directory-watching function using ReadDirectoryChangesW
void WatchDirectory(const std::wstring& directory)
{
	// Perform an initial scan of the directory to log existing paths
	LogExistingPaths(directory);

	std::wcout << L"Finished logging existing paths: You can proceed" << std::endl;

	HANDLE hDir = CreateFile(
		directory.c_str(),
		FILE_LIST_DIRECTORY,
		FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
		NULL,
		OPEN_EXISTING,
		FILE_FLAG_BACKUP_SEMANTICS,
		NULL
	);

	if (hDir == INVALID_HANDLE_VALUE) {
		std::cerr << "Error: Could not open directory for watching." << std::endl;
		return;
	}

	char buffer[1024];
	DWORD bytesReturned;

	while (true) {
		if (ReadDirectoryChangesW(
			hDir,
			&buffer,
			sizeof(buffer),
			TRUE,
			FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME |
			FILE_NOTIFY_CHANGE_ATTRIBUTES | FILE_NOTIFY_CHANGE_SIZE |
			FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_CREATION,
			&bytesReturned,
			NULL,
			NULL
		)) {
			FILE_NOTIFY_INFORMATION* fni = (FILE_NOTIFY_INFORMATION*)buffer;
			do {
				std::wstring fileName(fni->FileName, fni->FileNameLength / sizeof(WCHAR));

				// Construct full path
				std::wstring fullPath = directory + L"\\" + fileName;

				bool isDir;
				switch (fni->Action) {
				case FILE_ACTION_ADDED:
				case FILE_ACTION_RENAMED_NEW_NAME: // Treat new name after renaming as creation
					isDir = IsDirectory(fullPath);
					pathTypeCache[fullPath] = isDir;  // Cache the type (directory or file)
					if (isDir) {
						std::wcout << L"Directory created: " << fullPath << std::endl;
					}
					else {
						std::wcout << L"File created: " << fullPath << std::endl;
					}
					std::wcout.flush();  // Ensure immediate output
					break;

				case FILE_ACTION_REMOVED:
				case FILE_ACTION_RENAMED_OLD_NAME: // Treat old name before renaming as deletion
					if (pathTypeCache.find(fullPath) != pathTypeCache.end()) {
						isDir = pathTypeCache[fullPath];
						pathTypeCache.erase(fullPath);  // Remove from cache after deletion
					}
					else {
						isDir = false; // Default to file if we don’t have cached information
					}

					if (isDir) {
						std::wcout << L"Directory deleted: " << fullPath << std::endl;
					}
					else {
						std::wcout << L"File deleted: " << fullPath << std::endl;
					}
					std::wcout.flush();  // Ensure immediate output
					break;

				case FILE_ACTION_MODIFIED:
					if (!IsDirectory(fullPath)) { // Only handle file modifications
						std::wcout << L"File modified: " << fullPath << std::endl;
						std::wcout.flush();  // Ensure immediate output
					}
					break;

				default:
					break;
				}

				if (fni->NextEntryOffset == 0) break;
				fni = (FILE_NOTIFY_INFORMATION*)((LPBYTE)fni + fni->NextEntryOffset);

			} while (true);
		}
		else {
			std::cerr << "Error: ReadDirectoryChangesW failed." << std::endl;
			break;
		}
	}

	CloseHandle(hDir);
}

// Entry point: initialize directory watching based on command-line arguments
int _tmain(int argc, _TCHAR* argv[])
{
	if (argc < 2) {
		MessageBox(NULL, L"Usage: xp_chokidar <path_to_watch>", L"Error", MB_OK | MB_ICONERROR);
		return 1;
	}

	std::wstring directoryToWatch = argv[1];
	WatchDirectory(directoryToWatch);

	return 0;
}
