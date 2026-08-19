#!/usr/bin/env python3
"""
Advanced Host-Side Vision & UI Locator Agent for Windows 10
Leverages OCR (Tesseract) and Computer Vision (OpenCV) to find and click UI elements automatically.
"""

import os
import time
import pytesseract
import cv2
import numpy as np
from PIL import Image
from win_bridge import WinBridge

SCREEN_PATH = "/tmp/windows-storage/live_screen.png"

class WinVisionAgent:
    @staticmethod
    def get_latest_screen():
        WinBridge.capture_screen(SCREEN_PATH)
        return SCREEN_PATH

    @staticmethod
    def find_all_text_elements():
        """
        Runs OCR on the current live screen and returns a list of detected words with bounding boxes.
        """
        img_path = WinVisionAgent.get_latest_screen()
        img = Image.open(img_path)
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        
        elements = []
        n_boxes = len(data['text'])
        for i in range(n_boxes):
            text = data['text'][i].strip()
            if text:
                x = data['left'][i]
                y = data['top'][i]
                w = data['width'][i]
                h = data['height'][i]
                center_x = x + w // 2
                center_y = y + h // 2
                elements.append({
                    'text': text,
                    'box': (x, y, w, h),
                    'center': (center_x, center_y),
                    'conf': data['conf'][i]
                })
        return elements

    @staticmethod
    def find_text(target_text, exact=False):
        """
        Finds the center (x, y) coordinates of a word/phrase on screen.
        """
        elements = WinVisionAgent.find_all_text_elements()
        target_lower = target_text.lower()
        for elem in elements:
            text = elem['text'].lower()
            if (target_lower == text) if exact else (target_lower in text):
                return elem['center']
        return None

    @staticmethod
    def click_text(target_text, exact=False):
        """
        Visually locates text on screen and clicks on it.
        """
        coords = WinVisionAgent.find_text(target_text, exact=exact)
        if coords:
            print(f"Located '{target_text}' at screen coords: {coords}")
            WinBridge.click(coords[0], coords[1])
            return True
        else:
            print(f"Could not visually find '{target_text}' on screen.")
            return False

if __name__ == "__main__":
    print("Testing Vision Agent OCR...")
    elements = WinVisionAgent.find_all_text_elements()
    print(f"Detected {len(elements)} text elements on screen.")
    sample = [e['text'] for e in elements[:10]]
    print("Sample detected text:", sample)
