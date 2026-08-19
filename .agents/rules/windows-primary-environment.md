# HARD RULE: Primary Execution Environment is Windows 10

## Core Directive
The active, dedicated **Windows 10 Pro virtualized environment** (running via Docker with `/dev/kvm` acceleration) is the **primary operating system and execution environment** for all tasks in this workspace.

---

## Standard Operating Procedures

1. **GUI & Automation Operations:**
   - Use the unified bridge library `/workspaces/Weed-fly/windows/win_bridge.py` (`WinBridge`) for:
     - `WinBridge.click(x, y)` / `WinBridge.drag(x1, y1, x2, y2)` for hardware-level mouse cursor control.
     - `WinBridge.type_text(text)` / `WinBridge.hotkey(*keys)` for keyboard inputs and shortcuts.
     - `WinBridge.run_powershell(script_content)` for executing PowerShell scripts and capturing output.
     - `WinBridge.capture_screen()` for instant live vision perception.

2. **Installed Applications Available on Windows 10:**
   - **Browsers:** Google Chrome, Microsoft Edge
   - **Communication:** Telegram Desktop
   - **Automation & Scripting:** AutoHotkey v2 (`AutoHotkey.exe`), Windows PowerShell, CMD
   - **Productivity & Editors:** Notepad++, Notepad, MS Paint, Calculator, Task Manager
   - **Utilities:** 7-Zip, RustDesk (Native Remote Control), VirtIO Drivers

3. **File Exchange & Synchronization:**
   - Two-way shared folder: `/tmp/windows-storage` (Host) <--> `\\host.lan\Data` (Windows `Z:`).
   - Any files, reports, datasets, or scripts created must be synchronized to the Windows desktop (`C:\Users\Docker\Desktop\`) or shared folder.

4. **Live Desktop Web Streaming:**
   - Active Cloudflare endpoint: `https://usc-seo-ericsson-pop.trycloudflare.com` (Port 8006).
   - Remote Desktop (RDP): Port 3389.
