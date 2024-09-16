@echo off
set projectName=XPCode

cd ../BuiltApp/%projectName%/package.nw
echo %cd%

call npm install