# 🪟 Windows 10 Virtualized Environment & Automation Suite

This directory contains a complete, portable, hardware-accelerated **Windows 10 Pro virtualized operating system environment** equipped with automation bridges, live computer vision perception, low-latency web streaming, and multi-protocol remote desktop capabilities.

---

## 📋 Table of Contents
- [Architecture & Overview](#-architecture--overview)
- [Prerequisites & System Requirements](#-prerequisites--system-requirements)
- [Quickstart (1-Command Launch)](#-quickstart-1-command-launch)
- [Remote Access Methods](#-remote-access-methods)
  - [1. Low-Latency Web Streaming (Browser)](#1-low-latency-web-streaming-browser)
  - [2. Microsoft Remote Desktop (RDP - Port 3389)](#2-microsoft-remote-desktop-rdp---port-3389)
  - [3. RustDesk (Mobile & Desktop App - 60 FPS)](#3-rustdesk-mobile--desktop-app---60-fps)
- [Host-Guest Automation & CLI (`winctl`)](#-host-guest-automation--cli-winctl)
- [Performance & Latency Optimization](#-performance--latency-optimization)
- [Two-Way File Synchronization](#-two-way-file-synchronization)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏗️ Architecture & Overview

```
+---------------------------------------------------------------------------------+
|                                HOST ENVIRONMENT                                 |
|                                                                                 |
|  +--------------------+     +---------------------+     +--------------------+  |
|  |    winctl (CLI)    |     |  WinVisionAgent     |     |   WinBridge (SDK)  |  |
|  |  (OCR/Mouse/Keys)  |     |  (Tesseract/OpenCV) |     |  (Socket & QEMU)   |  |
|  +---------+----------+     +----------+----------+     +---------+----------+  |
|            |                           |                          |             |
|            +---------------------------+--------------------------+             |
|                                        |                                        |
|                          +-------------v-------------+                          |
|                          |   Docker Container:       |                          |
|                          |   dockurr/windows:latest  |                          |
|                          +-------------+-------------+                          |
|                                        |                                        |
|                       +----------------v----------------+                       |
|                       |   QEMU / KVM Virtual Machine    |                       |
|                       |   - Windows 10 Pro (x64)        |                       |
|                       |   - 4 vCPUs | 8 GB RAM          |                       |
|                       |   - VirtIO SCSI + VirtIO Net    |                       |
|                       |   - RDP (3389) + noVNC (8006)   |                       |
|                       +---------------------------------+                       |
+---------------------------------------------------------------------------------+
```

---

## 💻 Prerequisites & System Requirements

* **Operating System:** Linux (Ubuntu/Debian, Fedora, Arch), GitHub Codespaces, or Windows WSL2.
* **Virtualization:** Hardware KVM support (`/dev/kvm`).
* **RAM:** Minimum 6 GB (8 GB recommended).
* **Disk Space:** 45 GB free space for virtual disk and OS image.
* **Software:** Docker (`docker` & `docker compose`), Python 3.10+, `curl`.

---

## 🚀 Quickstart (1-Command Launch)

To start the entire environment from any terminal:

```bash
cd /workspaces/Weed-fly/windows
./setup.sh
```

This automated script will:
1. Initialize storage permissions in `/tmp/windows-storage`.
2. Verify hardware KVM virtualization acceleration.
3. Launch the container via `docker compose`.
4. Establish the public Cloudflare tunnel for web access.
5. Print all connection links and credentials.

---

## 🌐 Remote Access Methods

### 1. Low-Latency Web Streaming (Browser)
Connect directly through any web browser without installing any software.

* **Local URL:** `http://127.0.0.1:8006/vnc.html?autoconnect=true&resize=scale&quality=5&compression=4&show_dot=true`
* **Cloudflare Tunnel URL:** Run `./setup.sh` or check the terminal output for the latest `.trycloudflare.com` link.
* **In-Browser Speed Tips:**
  - Open the left-hand slide menu (⚙️ gear icon).
  - Enable **Local Dot Cursor** (eliminates mouse latency).
  - Set **Scaling** to **Remote Rescaling** or **Local Scaling**.

---

### 2. Microsoft Remote Desktop (RDP - Port 3389)
Native RDP provides hardware-accelerated drawing commands for 60 FPS silky-smooth response.

* **Port:** `3389`
* **Username:** `docker`
* **Password:** `123456`

#### How to Connect:
* **Windows PC:**
  1. Press `Win + R`, type `mstsc`, and hit **Enter**.
  2. Enter Computer: `localhost:3389` (or the public tunnel address).
  3. Enter User: `docker`, Password: `123456`.
* **Mac / iOS / Android:**
  1. Install the free **Microsoft Remote Desktop** app.
  2. Add PC &rarr; PC Name: `localhost:3389` (or public tunnel).
  3. Add User Account &rarr; `docker` / `123456`.

---

### 3. RustDesk (Mobile & Desktop App - 60 FPS)
RustDesk provides direct WebRTC P2P streaming designed for mobile devices.

1. Install **RustDesk** from the [Google Play Store](https://play.google.com/store/apps/details?id=com.carriez.flutter_rustdesk) or [Apple App Store](https://apps.apple.com/app/rustdesk-remote-desktop/id1581375549).
2. Start RustDesk inside Windows (pre-installed on Desktop).
3. Enter the 9-digit **Remote ID** and **One-Time Password** shown in the RustDesk window.

---

## 🛠️ Host-Guest Automation & CLI (`winctl`)

Control, automate, and inspect the Windows guest directly from the host terminal:

| Command | Description | Example |
| :--- | :--- | :--- |
| `winctl run "<script>"` | Execute PowerShell script in Windows and get output | `python3 winctl run 'Get-ComputerInfo'` |
| `winctl screen [--out <path>]` | Capture live PNG screenshot of the Windows screen | `python3 winctl screen --out /tmp/screen.png` |
| `winctl ocr` | Scan screen and print detected text elements | `python3 winctl ocr` |
| `winctl click-text "<text>"` | Find text on screen using OCR and click it | `python3 winctl click-text 'Start'` |
| `winctl click <x> <y>` | Click exact pixel coordinates (0-1280, 0-800) | `python3 winctl click 16 780` |
| `winctl drag <x1> <y1> <x2> <y2>` | Click and drag between coordinates | `python3 winctl drag 100 100 400 400` |
| `winctl type "<text>"` | Send keystrokes to focused window | `python3 winctl type 'notepad.exe'` |
| `winctl key "<key_combo>"` | Send key combinations | `python3 winctl key 'meta_l-r'` |
| `winctl record <duration_sec>` | Record video clip of the live screen to MP4 | `python3 winctl record 5 --out demo.mp4` |

---

## ⚡ Performance & Latency Optimization

To optimize the Windows 10 OS for maximum speed:

1. **Run the Automated Optimization Script:**
   ```bash
   python3 winctl run "$(cat /workspaces/Weed-fly/windows/optimize.ps1)"
   ```
2. **Applied Optimizations:**
   - Visual Effects adjusted for Best Performance (disabled animations, fade/slide menus, transparency, and drop shadows).
   - High Performance Power Plan activated (`SCHEME_MIN`).
   - Heavy background services disabled (`SysMain`, `WSearch`, `DiagTrack`).
   - GameDVR, Telemetry, and Cortana background indexing disabled.
   - QEMU VNC `LOSSY="Y"` enabled for high compression / low network delay.

---

## 🔄 Two-Way File Synchronization

* **Host Directory:** `/tmp/windows-storage`
* **Windows Guest Path:** `\\host.lan\Data` (or Network Drive `Z:`)
* Any files dropped into `/tmp/windows-storage` appear instantly inside Windows.

---

## ❓ Troubleshooting & FAQ

#### Q: How do I change the allocated CPU or RAM?
Modify `windows/docker-compose.yml`:
```yaml
environment:
  RAM_SIZE: "8G"
  CPU_CORES: "4"
```
Then restart with `docker compose up -d --force-recreate`.

#### Q: The screen capture shows a black screen or "Getting ready".
When first booted, Windows 10 creates the default user profile. Wait ~30-60 seconds for the desktop to initialize. Check status with `python3 winctl screen`.

#### Q: How do I reset the Windows password?
Run via `winctl`:
```bash
python3 winctl run "net user docker NewPassword123!"
```
