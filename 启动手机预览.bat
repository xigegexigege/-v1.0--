@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Tiaohuan Mockup - Phone Preview

set "NODECMD="

where node >nul 2>nul
if not errorlevel 1 set "NODECMD=node"

if not defined NODECMD (
  for /d %%D in ("%USERPROFILE%\.cache\codex-runtimes\*") do (
    if exist "%%D\dependencies\node\bin\node.exe" set "NODECMD=%%D\dependencies\node\bin\node.exe"
  )
)

if not defined NODECMD (
  echo [ERROR] Node.js not found. Please install Node.js first:
  echo         https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo Starting local preview server...
echo 1. Keep this window open.
echo 2. Make sure your phone is on the SAME Wi-Fi as this computer.
echo 3. Open the http:// address shown below in your phone browser.
echo.
"%NODECMD%" "%~dp0serve.js" 8899
echo.
echo Server stopped. Press any key to close this window.
pause >nul
