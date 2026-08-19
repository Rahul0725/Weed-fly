#!/usr/bin/env bash
set -e

# ==============================================================================
# Master Automated Launcher & Environment Setup for Windows 10 OS
# Works on GitHub Codespaces, Linux VPS, Docker on WSL2 / Local Machine
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STORAGE_DIR="/tmp/windows-storage"

echo "========================================================"
echo "   🚀 Initializing Virtualized Windows 10 Environment"
echo "========================================================"

# 1. Ensure storage directory permissions
echo "[1/5] Preparing storage directory at $STORAGE_DIR..."
sudo mkdir -p "$STORAGE_DIR"
sudo chmod -R 777 "$STORAGE_DIR" 2>/dev/null || true

# 2. Check for KVM hardware acceleration
echo "[2/5] Checking hardware virtualization (KVM)..."
if [ -e /dev/kvm ]; then
    echo "  -> /dev/kvm is AVAILABLE (Hardware acceleration enabled)"
    sudo chmod 666 /dev/kvm 2>/dev/null || true
else
    echo "  -> /dev/kvm not detected. Running with software fallback."
fi

# 3. Start Docker Compose
echo "[3/5] Starting Windows container..."
cd "$SCRIPT_DIR"
docker compose up -d

echo "  -> Waiting for container to initialize..."
sleep 5

# 4. Download and setup Cloudflared Tunnel (for Web Display)
echo "[4/5] Setting up Cloudflare Web Tunnel..."
if ! command -v /tmp/cloudflared &> /dev/null; then
    curl -fsSL -o /tmp/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
    chmod +x /tmp/cloudflared
fi

# Kill any existing cloudflared instances
pkill -f "cloudflared tunnel --url http://127.0.0.1:8006" 2>/dev/null || true

# Start tunnel in background
nohup /tmp/cloudflared tunnel --url http://127.0.0.1:8006 --logfile /tmp/cloudflared.log >/dev/null 2>&1 &

echo "  -> Waiting for tunnel URL generation..."
sleep 5
TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' /tmp/cloudflared.log | tail -n 1 || echo "")

# 5. Summary & Connection Details
echo "========================================================"
echo "   ✅ Windows 10 Environment is Online and Ready!"
echo "========================================================"
echo ""
echo "🌐 1. High-Performance Web Access (Browser):"
if [ -n "$TUNNEL_URL" ]; then
    echo "   🔗 $TUNNEL_URL/vnc.html?autoconnect=true&resize=scale&quality=5&compression=4&show_dot=true"
else
    echo "   🔗 http://127.0.0.1:8006"
fi
echo ""
echo "🖥️ 2. Microsoft Remote Desktop (RDP - Port 3389):"
echo "   - Host: localhost:3389 (or forwarded port)"
echo "   - Username: docker"
echo "   - Password: 123456"
echo ""
echo "📱 3. RustDesk (Mobile / PC 60 FPS Remote App):"
echo "   - Run: python3 $SCRIPT_DIR/winctl screen"
echo "   - Check the RustDesk window for your 9-digit Remote ID & Password"
echo ""
echo "⚙️ 4. Host Automation CLI:"
echo "   - Execute command:  python3 $SCRIPT_DIR/winctl run 'Get-Process'"
echo "   - Capture screen:   python3 $SCRIPT_DIR/winctl screen --out /tmp/screen.png"
echo "   - Click OCR text:   python3 $SCRIPT_DIR/winctl click-text 'Start'"
echo "========================================================"
