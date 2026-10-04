---
name: wsl-windows-ops
version: 1.0.0
description: Use when the Windows host must be driven from WSL.
license: MIT
platforms: [wsl]
---

# Windows host operations from WSL

Shams's Hermes runs in WSL over a Windows host; the host side is reachable only through the /mnt/c executables. Everything below is the verified working form — the raw first attempts (bare `powershell`, double-quoted commands, ACPI class) all fail silently or noisily in different ways.

## Verified commands

- **Shutdown:** `/mnt/c/Windows/System32/shutdown.exe /s /t 90 /c 'Shams asked ARKAN to shut down. Aborting: shutdown -a'` — exit 0 confirms scheduling. Always leave 90 s grace so the platform reply reaches him first; the `/c` message doubles as the abort hint (any cmd: `shutdown -a` cancels).
- **PowerShell from bash:** invoke the FULL path `/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` — there is no powershell.exe directly in System32 (FileNotFound if you try), and wmic no longer ships on current Windows.
- **Quoting:** SINGLE-quote the whole `-Command '…'` argument. Double quotes let bash expand `$variables` to empty strings before PowerShell ever sees them (an `$t` check became `if ()` → parse error).
- **CPU temperature:** `root/wmi MSAcpi_ThermalZoneTemperature` is often not exposed (returns nothing = ACPI_NOT_EXPOSED). The working source is the performance counter:
  ```
  powershell.exe -NoProfile -Command 'Get-CimInstance -ClassName Win32_PerfFormattedData_Counters_ThermalZoneInformation | Select-Object -First 4 | ForEach-Object { $_.Name.ToString() + " -> " + $_.Temperature.ToString() }'
  ```
  `Temperature` is tenths of Kelvin: °C = value/10 − 273.15 (e.g. 317 → 31.7 °C, idle-cool). WSL `/sys/class/thermal` shows only cooling devices — no temp zones — when the host is accessed through WSL, so go to the Windows counter directly.

## Pitfalls

- **Print structure only when Windows-side reads touch credential-bearing files** — same discipline as Hermes .env handling: names, lengths, shapes; never the value.
- **GUI capture tools bind the WSL session's DISPLAY** — from this backend there is no Windows-desktop surface, so "computer use" actions on the Windows side aren't reachable from the WSL session. For host-state questions run the PowerShell probe above or ask Shams to look at his screen; say plainly when a visual check can't be done from this side rather than retrying a capture that will return a 0×0 empty frame.
- `cmd.exe` from a WSL cwd inside `\wsl.localhost\…` warns "UNC paths not supported, defaulting to Windows directory" — harmless for pure queries, but commands that rely on the cwd silently run elsewhere; pass explicit Windows paths inside the command instead of counting on cwd.