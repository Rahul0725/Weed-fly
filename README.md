<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Topologica & Virtualized Windows 10 OS Environment

This repository contains two integrated systems:
1. **Topologica 4D Game / Web App**: A high-performance 4D raymarching simulation & interactive web application built with React, WebGL2/WebGPU shaders, and Gemini AI.
2. **Virtualized Windows 10 OS & Automation Suite**: A fully automated, hardware-accelerated Windows 10 virtual operating system environment running inside Docker with KVM, low-latency web streaming, Remote Desktop (RDP), RustDesk, and Python OCR/automation CLI.

---

## 🪟 Quickstart: Run Windows 10 OS Environment

To start the Windows 10 virtual environment and stream the desktop anywhere:

```bash
# 1. Navigate to the windows directory
cd windows

# 2. Run the 1-command automated setup script
./setup.sh
```

### Accessing the Windows OS:
* **🌐 Web Browser:** Open the displayed Cloudflare Tunnel URL or `http://localhost:8006`
* **🖥️ Microsoft Remote Desktop (RDP - Port 3389):**
  - **Host:** `localhost:3389`
  - **Username:** `docker`
  - **Password:** `123456`
* **📱 Mobile App (RustDesk 60 FPS):** Download RustDesk on iOS/Android, connect to the displayed ID.
* **🛠️ CLI Controller:** Run `python3 windows/winctl --help` for programmatic control, OCR clicking, and screenshots.

> For full details, see the [Windows OS Documentation](windows/README.md).

---

## 🎮 Quickstart: Run Web Application Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your `GEMINI_API_KEY` in `.env.local`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
├── windows/                      # Virtualized Windows 10 Environment
│   ├── docker-compose.yml        # Docker & QEMU configuration (4 Cores, 8GB RAM)
│   ├── setup.sh                  # 1-Click launcher script
│   ├── optimize.ps1              # Performance & latency tuning script
│   ├── winctl                    # Master CLI controller (OCR, clicks, PowerShell)
│   ├── win_bridge.py             # Python automation bridge SDK
│   ├── win_vision_agent.py       # Tesseract OCR & OpenCV computer vision agent
│   └── README.md                 # In-depth Windows environment documentation
├── src/                          # Topologica 4D Game & Raymarching Engine
│   ├── components/               # React HUD & Modal components
│   ├── engine/                   # 4D Raymarching shaders & GPUParticles
│   ├── audio/                    # Harmonic Audio synthesis engine
│   └── game/                     # Game state and level design
├── components/                   # Legacy UI & game renderer
├── scripts/                      # Automated playtesters, benchmarks & visual regression tests
└── package.json                  # Node dependencies and build scripts
```

---

## 📄 License
This project is open-source under the MIT License.
