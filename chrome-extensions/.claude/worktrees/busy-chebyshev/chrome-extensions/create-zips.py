"""
Create ZIP files for each Chrome extension, ready for Chrome Web Store submission.
Excludes unnecessary files like .DS_Store, __pycache__, etc.
"""
import zipfile
from pathlib import Path

EXT_BASE = Path(r"C:\Users\81906\app\something\chrome-extensions\.claude\worktrees\busy-chebyshev\chrome-extensions")
OUT_DIR = EXT_BASE / "zips"
OUT_DIR.mkdir(exist_ok=True)

EXTENSIONS = [
    "color-peek", "json-view", "markdown-copy", "page-meta",
    "quick-note", "regex-playground", "response-peek", "select-tools"
]

EXCLUDE = {".DS_Store", "__pycache__", ".git", "Thumbs.db"}

for ext_name in EXTENSIONS:
    ext_dir = EXT_BASE / ext_name
    zip_path = OUT_DIR / f"{ext_name}.zip"

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in sorted(ext_dir.rglob("*")):
            if file_path.is_file() and not any(ex in file_path.parts for ex in EXCLUDE):
                arcname = file_path.relative_to(ext_dir)
                zf.write(file_path, arcname)

    # Get file count and size
    size_kb = zip_path.stat().st_size / 1024
    with zipfile.ZipFile(zip_path, "r") as zf:
        file_count = len(zf.namelist())

    print(f"  {ext_name}.zip  ({file_count} files, {size_kb:.1f} KB)")

print(f"\nAll ZIPs created in: {OUT_DIR}")
