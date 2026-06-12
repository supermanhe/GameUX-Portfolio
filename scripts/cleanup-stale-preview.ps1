# Watchdog: kill orphaned dev/preview servers left behind by AI agent sessions.
#
# Background (2026-06-08 incident): a Claude Preview dev server for this project
# was auto-assigned port 56536, kept running ~11 hours after the task finished,
# and its browser reload loop (13k+ load timeouts) re-fetched Cloudinary
# originals repeatedly, burning 62 GB of image CDN bandwidth.
# Killing the dev server stops the bleed: page reloads then fail instantly
# without fetching any remote images.
#
# Registered as scheduled task "GameUX-PreviewWatchdog" (every 30 min).
# Manual run:  powershell -ExecutionPolicy Bypass -File scripts\cleanup-stale-preview.ps1
# Kill regardless of age:  ... -MaxAgeHours 0

param(
  # Kill `next dev` for this project when older than this. Active agent
  # sessions occasionally run this long; they just restart the server.
  [double]$MaxAgeHours = 2,
  # `next start` may be the owner viewing the site locally - give it longer.
  [double]$MaxStartAgeHours = 24,
  # design-battle gallery servers from the design-battle skill.
  [double]$MaxBattleAgeHours = 12
)

$projectPath = 'GameUX-Portfolio'
$logFile = Join-Path $PSScriptRoot 'preview-cleanup.log'
$now = Get-Date

function Write-Log([string]$msg) {
  $line = "{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $msg
  Add-Content -Path $logFile -Value $line -Encoding utf8
}

$nodeProcs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue

# Servers registered with the shared preview-session manager are accounted for
# (their owner is responsible for stopping them) - exempt them and their
# child processes so the watchdog only reaps unmanaged orphans.
$exempt = New-Object 'System.Collections.Generic.HashSet[uint32]'
try {
  $table = preview-session list --all 2>$null | Out-String
  foreach ($m in [regex]::Matches($table, "│\s*\d+\s*│\s*'[^']*'\s*│\s*'\d+'\s*│\s*'(\d+)'")) {
    [void]$exempt.Add([uint32]$m.Groups[1].Value)
  }
} catch {}
if ($exempt.Count -gt 0) {
  $allProcs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue
  $added = $true
  while ($added) {
    $added = $false
    foreach ($p in $allProcs) {
      if ($exempt.Contains([uint32]$p.ParentProcessId) -and -not $exempt.Contains([uint32]$p.ProcessId)) {
        [void]$exempt.Add([uint32]$p.ProcessId)
        $added = $true
      }
    }
  }
}

$killed = 0

foreach ($proc in $nodeProcs) {
  if ($exempt.Contains([uint32]$proc.ProcessId)) { continue }
  $cl = $proc.CommandLine
  if (-not $cl) { continue }

  $limitHours = $null
  $kind = $null
  if ($cl -match [regex]::Escape($projectPath)) {
    if ($cl -match 'next[\\/"]dist[\\/"]bin[\\/"]next"?\s+dev' -or $cl -match '"?next"?\s+dev') {
      $limitHours = $MaxAgeHours; $kind = 'next dev'
    } elseif ($cl -match '"?next"?\s+start' -or $cl -match 'next[\\/"]dist[\\/"]bin[\\/"]next"?\s+start') {
      $limitHours = $MaxStartAgeHours; $kind = 'next start'
    }
  } elseif ($cl -match 'design-battle\.mjs"?\s+serve') {
    $limitHours = $MaxBattleAgeHours; $kind = 'design-battle'
  }
  if ($null -eq $limitHours) { continue }

  try { $started = Get-Process -Id $proc.ProcessId -ErrorAction Stop | Select-Object -ExpandProperty StartTime } catch { continue }
  $ageHours = ($now - $started).TotalHours
  if ($ageHours -lt $limitHours) { continue }

  try {
    Stop-Process -Id $proc.ProcessId -Force -Confirm:$false -ErrorAction Stop
    $killed++
    Write-Log ("KILLED pid={0} kind={1} age={2:N1}h cmd={3}" -f $proc.ProcessId, $kind, $ageHours, $cl.Substring(0, [Math]::Min(140, $cl.Length)))
  } catch {
    Write-Log ("FAILED pid={0} kind={1}: {2}" -f $proc.ProcessId, $kind, $_.Exception.Message)
  }
}

if ($killed -eq 0) {
  # Keep the log quiet on no-op runs; uncomment to trace every run.
  # Write-Log 'ok - nothing stale'
}
