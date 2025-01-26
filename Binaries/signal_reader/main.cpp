#include <iostream>
#include <thread>
#include <chrono>
#include <string>
#include <fstream>

// Example of signal emulation: monitor for a trigger file (or any event mechanism)
void monitorForSignals() {
	const std::string triggerFilePath = "signal.txt";

	while (true) {
		std::ifstream triggerFile(triggerFilePath);

		if (triggerFile.is_open()) {
			std::string line;
			while (std::getline(triggerFile, line)) {
				if (!line.empty()) {
					// Emit the signal via std::cout
					std::cout << line << std::endl;
					std::flush(std::cout);

					// Clear the trigger file after reading
					std::ofstream clearFile(triggerFilePath, std::ofstream::trunc);
					clearFile.close();
				}
			}
			triggerFile.close();
		}

		// Avoid busy looping
		std::this_thread::sleep_for(std::chrono::seconds(1));
	}
}

int main() {
	std::cout << "Signal Reader" << std::endl;
	std::flush(std::cout);

	// Start monitoring in a separate thread
	std::thread signalThread(monitorForSignals);

	// Keep the main thread alive
	signalThread.join();

	return 0;
}
