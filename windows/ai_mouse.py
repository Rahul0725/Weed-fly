import socket
import time
import sys
from PIL import Image

MONITOR_SOCK = '/run/shm/monitor.sock'
SCREEN_WIDTH = 1280.0
SCREEN_HEIGHT = 800.0

def send_qemu_cmd(cmd):
    s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    s.connect(MONITOR_SOCK)
    s.sendall((cmd + '\n').encode())
    time.sleep(0.04)
    res = s.recv(1024)
    s.close()
    return res

def move(x, y):
    qx = int((x / SCREEN_WIDTH) * 32767)
    qy = int((y / SCREEN_HEIGHT) * 32767)
    send_qemu_cmd(f"mouse_move {qx} {qy}")
    time.sleep(0.05)

def click(x, y, button=1):
    move(x, y)
    send_qemu_cmd(f"mouse_button {button}")
    time.sleep(0.08)
    send_qemu_cmd("mouse_button 0")

def double_click(x, y):
    click(x, y)
    time.sleep(0.1)
    click(x, y)

def right_click(x, y):
    click(x, y, button=4)

def drag(x1, y1, x2, y2):
    move(x1, y1)
    send_qemu_cmd("mouse_button 1")
    time.sleep(0.1)
    steps = 10
    for i in range(1, steps + 1):
        cx = x1 + (x2 - x1) * (i / steps)
        cy = y1 + (y2 - y1) * (i / steps)
        move(cx, cy)
    time.sleep(0.1)
    send_qemu_cmd("mouse_button 0")

def screenshot(out_path="/tmp/screen_current.png"):
    send_qemu_cmd("screendump /tmp/screen_shot.ppm")
    time.sleep(0.2)
    im = Image.open("/tmp/screen_shot.ppm")
    im.save(out_path)
    return out_path

if __name__ == '__main__':
    print("AI Mouse Control Library Ready.")
