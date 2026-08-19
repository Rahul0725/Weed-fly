import subprocess
import time
import os
from PIL import Image

STORAGE_DIR = "/tmp/windows-storage"
PPM_FILE = os.path.join(STORAGE_DIR, "live_screen.ppm")
PNG_FILE = os.path.join(STORAGE_DIR, "live_screen.png")

def trigger_screen():
    subprocess.run([
        "docker", "exec", "-i", "windows", "python3", "-c",
        "import socket; s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM); s.connect('/run/shm/monitor.sock'); s.sendall(b'screendump /storage/live_screen.ppm\\n'); s.close()"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def loop():
    print("Host Live Vision Stream Started.")
    while True:
        try:
            trigger_screen()
            if os.path.exists(PPM_FILE):
                im = Image.open(PPM_FILE)
                im.save(PNG_FILE)
            time.sleep(0.5)
        except Exception as e:
            time.sleep(1.0)

if __name__ == '__main__':
    loop()
