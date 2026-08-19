# Windows 10 Performance Optimization & RDP Setup Script
Write-Host ">>> Starting Windows 10 Optimization Pipeline..." -ForegroundColor Cyan

# 1. Power Plan Optimization: Set to High Performance
try {
    powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 2>$null
    powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null
    powercfg -setactive SCHEME_MIN 2>$null
    Write-Host "[+] Power Plan: High Performance active." -ForegroundColor Green
} catch {
    Write-Warning "Failed to set Power Plan: $_"
}

# 2. Visual Effects: Adjust for Best Performance (Disable Animations & Shadows)
try {
    Set-ItemProperty -Path 'HKCU:\Control Panel\Desktop' -Name 'UserPreferencesMask' -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00)) -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Control Panel\Desktop\WindowMetrics' -Name 'MinAnimate' -Value '0' -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects' -Name 'VisualFXSetting' -Value 2 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize' -Name 'EnableTransparency' -Value 0 -ErrorAction SilentlyContinue
    Write-Host "[+] Visual Effects: Animations, shadows, and transparency disabled." -ForegroundColor Green
} catch {
    Write-Warning "Failed to adjust visual effects: $_"
}

# 3. Disable Resource-Heavy Background Services
$servicesToDisable = @("SysMain", "WSearch", "DiagTrack", "dmwappushservice", "MapsBroker")
foreach ($svc in $servicesToDisable) {
    try {
        Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
        Set-Service -Name $svc -StartupType Disabled -ErrorAction SilentlyContinue
        Write-Host "[+] Service disabled: $svc" -ForegroundColor Green
    } catch {
        Write-Warning "Could not disable service $svc"
    }
}

# 4. Disable GameDVR, Cortana, Bing Search
try {
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR' -Name 'AppCaptureEnabled' -Value 0 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search' -Name 'BingSearchEnabled' -Value 0 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Search' -Name 'CortanaConsent' -Value 0 -ErrorAction SilentlyContinue
    Write-Host "[+] Telemetry, Cortana, and GameDVR disabled." -ForegroundColor Green
} catch {
    Write-Warning "Failed to disable GameDVR/Search features: $_"
}

# 5. Remote Desktop (RDP) Configuration & Security
try {
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name 'fDenyTSConnections' -Value 0 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name 'UserAuthentication' -Value 0 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Lsa' -Name 'LimitBlankPasswordUse' -Value 0 -ErrorAction SilentlyContinue
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue
    
    # Ensure user credentials and group memberships
    net user docker 123456 /add 2>$null
    net user docker 123456 2>$null
    net localgroup "Remote Desktop Users" docker /add 2>$null
    net localgroup Administrators docker /add 2>$null
    Write-Host "[+] Remote Desktop: Configured (User: docker, Pass: 123456)." -ForegroundColor Green
} catch {
    Write-Warning "Failed to configure Remote Desktop: $_"
}

Write-Host ">>> Windows 10 Optimization Complete!" -ForegroundColor Cyan
