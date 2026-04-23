$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "ssh"
$processInfo.Arguments = "-R 80:localhost:8080 -o StrictHostKeyChecking=no nokey@localhost.run"
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true
$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo
$process.Start() | Out-Null
Start-Sleep -Seconds 5
$output = $process.StandardOutput.ReadToEnd()
$errorOutput = $process.StandardError.ReadToEnd()
Set-Content -Path "tunnel.log" -Value "STDOUT:`n$output`nSTDERR:`n$errorOutput"
