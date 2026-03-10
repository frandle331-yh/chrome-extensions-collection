$base = $PSScriptRoot
$out = Join-Path $base "zips"

if (!(Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

# Build ZIP from src/ directory for each extension
$extensions = @(
    "json-view",
    "response-peek",
    "snap-diff",
    "color-peek",
    "env-switch",
    "markdown-copy",
    "page-meta",
    "quick-note",
    "regex-playground",
    "select-tools"
)

foreach ($ext in $extensions) {
    $srcPath = Join-Path $base "$ext\src\*"
    $zipPath = Join-Path $out "$ext.zip"

    if (Test-Path (Join-Path $base "$ext\src")) {
        Compress-Archive -Path $srcPath -DestinationPath $zipPath -Force
        Write-Host "$ext.zip created"
    } else {
        Write-Host "SKIP: $ext/src/ not found" -ForegroundColor Yellow
    }
}

Write-Host "`nAll ZIPs:"
Get-ChildItem $out -Filter "*.zip" | ForEach-Object {
    Write-Host ("  {0}  ({1:N1} KB)" -f $_.Name, ($_.Length / 1KB))
}
