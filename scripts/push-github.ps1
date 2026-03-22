#Requires -Version 5.1
# 一键推送到 GitHub（HTTPS）
#
# 直连（不开代理 / 系统已全局翻墙）：
#   powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1
#
# 开着 Clash / v2rayN 等「本机 HTTP 代理」时，把端口改成软件里显示的（常见 7890、7897）：
#   powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1 -ProxyPort 7890

param(
  [int]$ProxyPort = 0
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if ($ProxyPort -gt 0) {
  $proxyUrl = "http://127.0.0.1:$ProxyPort"
  Write-Host "使用本机 HTTP 代理: $proxyUrl（请确认 VPN/Clash 已开且端口一致）" -ForegroundColor Cyan
  git config --global http.proxy $proxyUrl
  git config --global https.proxy $proxyUrl
} else {
  # 直连：清掉可能误配的代理
  git config --global --unset-all http.proxy 2>$null
  git config --global --unset-all https.proxy 2>$null
  git config --local --unset-all http.proxy 2>$null
  git config --local --unset-all https.proxy 2>$null
}

$origin = "https://github.com/zackpalumbi789-boop/personal_website.git"
if (git remote 2>$null | Where-Object { $_ -eq "origin" }) {
  git remote set-url origin $origin
} else {
  git remote add origin $origin
}

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "推送到 origin ($branch) ..." -ForegroundColor Cyan
git push -u origin $branch

if ($LASTEXITCODE -ne 0 -and $ProxyPort -eq 0) {
  Write-Host ""
  Write-Host "若已开 VPN 仍超时，多半是终端没走代理。请查看 Clash/v2rayN 的「HTTP 代理端口」，再执行：" -ForegroundColor Yellow
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1 -ProxyPort 你的端口" -ForegroundColor White
}
