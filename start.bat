@echo off
echo Starting Local Server on port 8081...
start powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File .\server.ps1
timeout /t 2 /nobreak > NUL
echo Server is running!
echo.
echo ========================================================
echo Starting Public Tunnel...
echo Wait for the link to appear below (it ends in .lhr.life)
echo Keep this window open to keep your site online!
echo ========================================================
echo.
ssh -o StrictHostKeyChecking=no -R 80:localhost:8081 nokey@localhost.run
pause
