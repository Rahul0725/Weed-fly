import socket
import time
import os
import threading
from PIL import Image

SHM_PATH = "/run/shm/live_screen.png"
PPM_PATH = "/run/shm/live_screen.ppm"
MONITOR_SOCK = "/run/shm/monitor.sock"

def vision_loop():
    print("Starting Live Vision Daemon...")
    while True:
        try:
            s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            s.connect(MONITOR_SOCK)
            s.sendall(f"screendump {PPM_PATH}\n".encode())
            s.close()
            
            if os.path.exists(PPM_PATH):
                im = Image.open(PPM_PATH)
                im.save(SHM_PATH, "PNG")
            time.sleep(0.5)
        except Exception as e:
            time.sleep(1.0)

if __name__ == '__main__':
    vision_loop()
