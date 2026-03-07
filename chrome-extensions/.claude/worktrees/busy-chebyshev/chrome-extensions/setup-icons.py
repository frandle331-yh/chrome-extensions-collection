"""
Copy icon PNGs into each extension folder, resize to 128/48/16,
and update manifest.json with icon paths.
"""
import json
import shutil
from pathlib import Path
from PIL import Image

ICONS_SRC = Path(r"C:\Users\81906\app\something\chrome-extensions\chrome_extension_icons_128.png_set")
EXT_BASE = Path(r"C:\Users\81906\app\something\chrome-extensions\.claude\worktrees\busy-chebyshev\chrome-extensions")

EXTENSIONS = [
    "color-peek", "json-view", "markdown-copy", "page-meta",
    "quick-note", "regex-playground", "response-peek", "select-tools"
]

SIZES = [128, 48, 16]

for ext_name in EXTENSIONS:
    ext_dir = EXT_BASE / ext_name
    icons_dir = ext_dir / "icons"
    icons_dir.mkdir(exist_ok=True)

    src_icon = ICONS_SRC / f"{ext_name}.png"
    if not src_icon.exists():
        print(f"WARNING: {src_icon} not found, skipping {ext_name}")
        continue

    # Resize and save
    img = Image.open(src_icon)
    for size in SIZES:
        resized = img.resize((size, size), Image.LANCZOS)
        out_path = icons_dir / f"icon{size}.png"
        resized.save(out_path, "PNG")
        print(f"  {ext_name}/icons/icon{size}.png")

    # Update manifest.json
    manifest_path = ext_dir / "manifest.json"
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    manifest["icons"] = {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    }

    if "action" in manifest:
        manifest["action"]["default_icon"] = {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png"
        }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"  {ext_name}/manifest.json updated")

print("\nDone! All icons resized and manifests updated.")
