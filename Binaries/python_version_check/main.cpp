#include <iostream>
#include <cstdio>  // For _popen and _pclose
#include <stdexcept>
#include <string>
#include <array>

std::string runCommand(const std::string& command) {
	std::array<char, 128> buffer;
	std::string result;

	// Use _popen for Windows
	FILE* pipe = _popen(command.c_str(), "r");
	if (!pipe) {
		throw std::runtime_error("Failed to open pipe");
	}

	try {
		// Read the command output
		while (fgets(buffer.data(), buffer.size(), pipe) != nullptr) {
			result += buffer.data();
		}
	}
	catch (...) {
		_pclose(pipe);
		throw;
	}

	_pclose(pipe);
	return result;
}

int main() {
	try {
		// Execute the command and capture the output
		std::string command = "python --version 2>&1";  // Redirect stderr to stdout
		std::string output = runCommand(command);

		// Print the output
		std::cout << "Python Version Output: " << output << std::endl;
	}
	catch (const std::exception& e) {
		// Print error if any
		std::cerr << "Error: " << e.what() << std::endl;
	}

	return 0;
}
