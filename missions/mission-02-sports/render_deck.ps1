param([string]$InFile, [string]$OutDir)
$ErrorActionPreference = "Stop"
$in  = [string]$InFile     # WINDOWS path to pptx
$out = [string]$OutDir     # WINDOWS dir for PNGs
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }
Write-Output "Input: $in"
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($in, $true, $false, $false)
  $i = 1
  foreach ($slide in $pres.Slides) {
    $png = Join-Path $out ("slide{0:d2}.png" -f $i)
    $slide.Export($png, "PNG", 1600, 900)
    Write-Output ("Exported " + $png)
    $i++
  }
  $pres.Close()
} finally {
  $pp.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null
}
Write-Output "DONE"