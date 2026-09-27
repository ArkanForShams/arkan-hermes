$ErrorActionPreference = 'Stop'
$src = 'C:\Users\SHAMS\hermes-workspace-missions\mission-03-beverage'
$deck = Join-Path $src 'deck-meridian.pptx'
$out = Join-Path $src 'render'
New-Item -ItemType Directory -Force -Path $out | Out-Null
if (Test-Path (Join-Path $out 'slide-01.png')) { Remove-Item (Join-Path $out '*.png') -Force }
$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Open($deck, $true, $false, $false)
$pres.SaveAs($out, 18)   # ppSaveAsPNG
$pres.Close()
$pp.Quit()
Write-Output "DONE renders:"
Get-ChildItem $out -Filter *.png | Select-Object -ExpandProperty Name