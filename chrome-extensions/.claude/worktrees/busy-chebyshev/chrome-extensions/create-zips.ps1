$base = "C:\Users\81906\app\something\chrome-extensions\.claude\worktrees\busy-chebyshev\chrome-extensions"
$outDir = Join-Path $base "zips"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$extensions = @("color-peek","json-view","markdown-copy","page-meta","quick-note","regex-playground","response-peek","select-tools")

foreach ($ext in $extensions) {
    $src = Join-Path $base $ext
    $dst = Join-Path $outDir "$ext.zip"
    if (Test-Path $dst) { Remove-Item $dst }
    Compress-Archive -Path "$src\*" -DestinationPath $dst -Force
    Write-Host "Created: $ext.zip"
}
