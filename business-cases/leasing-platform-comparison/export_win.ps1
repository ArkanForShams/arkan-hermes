# PowerPoint COM automation: export PDF + render slide PNGs from WSL-invoked Windows PowerShell
param([string]$Deck = "C:\Users\SHAMS\hermes-workspace\business-cases\leasing-platform-comparison\leasing-platform-comparison-ksa-THEMED.pptx",
      [string]$PdfPath = "C:\Users\SHAMS\hermes-workspace\business-cases\leasing-platform-comparison\leasing-platform-comparison-ksa-THEMED.pdf",
      [string]$PngDir = "C:\Users\SHAMS\hermes-workspace\business-cases\leasing-platform-comparison\render")
$ErrorActionPreference = "Stop"
$pp = New-Object -ComObject PowerPoint.Application
try {
    $pres = $pp.Presentations.Open($Deck, $true, $false, $false)  # ReadOnly, Untitled, WithWindow=false
    $pres.SaveAs($PdfPath, 32)          # 32 = ppSaveAsPDF
    Write-Output "PDF saved: $PdfPath"
    New-Item -ItemType Directory -Force -Path $PngDir | Out-Null
    $i = 0
    foreach ($slide in $pres.Slides) {
        $i++
        $name = "slide{0:d2}.png" -f $i
        $slide.Export((Join-Path $PngDir $name), "PNG", 1600, 900)
    }
    Write-Output ("PNGs exported: " + $i)
    $pres.Close()
} finally {
    $pp.Quit()
}