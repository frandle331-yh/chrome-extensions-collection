"""
Capture all 6 demo pages as exactly 1280x800, 24-bit PNG (no alpha).
Requires: playwright, Pillow
"""
from playwright.sync_api import sync_playwright
from PIL import Image
from pathlib import Path
import io

BASE_URL = "http://localhost:8765"
OUT_DIR = Path(r"C:\Users\81906\app\something\chrome-extensions\.claude\worktrees\busy-chebyshev\chrome-extensions\store-listings\screenshots")

PAGES = [
    ("demo-markdown-copy.html", "markdown-copy-screenshot.png"),
    ("demo-page-meta.html", "page-meta-screenshot.png"),
    ("demo-quick-note.html", "quick-note-screenshot.png"),
    ("demo-regex-playground.html", "regex-playground-screenshot.png"),
    ("demo-response-peek.html", "response-peek-screenshot.png"),
    ("demo-select-tools.html", "select-tools-screenshot.png"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    for html_file, output_name in PAGES:
        url = f"{BASE_URL}/{html_file}"
        page.goto(url, wait_until="networkidle")

        # Take screenshot as bytes
        screenshot_bytes = page.screenshot(type="png")

        # Open with Pillow, convert to RGB (removes alpha), resize to exact 1280x800
        img = Image.open(io.BytesIO(screenshot_bytes))
        img = img.convert("RGB")  # 24-bit, no alpha

        # Ensure exact size
        if img.size != (1280, 800):
            img = img.resize((1280, 800), Image.LANCZOS)

        out_path = OUT_DIR / output_name
        img.save(out_path, "PNG")
        print(f"  OK {output_name}  ({img.size[0]}x{img.size[1]}, RGB)")

    browser.close()

print(f"\nAll screenshots saved to: {OUT_DIR}")
