#Requires -Version 5.1
# 一键推送到 GitHub（仅 HTTPS，与常见用法一致）
# 用法：在项目根目录执行
#   powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

# 清掉误配的本地代理（避免连到 127.0.0.1 错误端口）
git config --global --unset-all http.proxy 2>$null
git config --global --unset-all https.proxy 2>$null
git config --local --unset-all http.proxy 2>$null
git config --local --unset-all https.proxy 2>$null

$origin = "https://github.com/zackpalumbi789-boop/personal_website.git"
if (git remote 2>$null | Where-Object { $_ -eq "origin" }) {
  git remote set-url origin $origin
} else {
  git remote add origin $origin
}

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "推送到 origin ($branch) ..." -ForegroundColor Cyan
git push -u origin $branch
