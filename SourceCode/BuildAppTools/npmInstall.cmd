@echo off
setlocal enabledelayedexpansion

:: Read APPLICATION_NAME from a text file (located in the parent directory)
cd ..
for /f "delims=" %%a in (appname.txt) do set APPLICATION_NAME=%%a
cd /d "%~dp0"

:: Navigate to the package directory
cd ../BuiltApp/%APPLICATION_NAME%/package.nw
echo %cd%

:: Install dependencies
call npm install
