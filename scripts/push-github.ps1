#Requires -Version 5.1
<#
.SYNOPSIS
  一键：清理常见 Git 代理误配 + 使用 HTTPS 推送到 origin（适合 Windows / Git for Windows）

用法（在项目根目录）:
  powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1

说明:
  - 会移除全局/本仓库的 http(s).proxy，避免连到错误的 127.0.0.1 端口
  - 强制 origin 使用 HTTPS（与浏览器同一套 GitHub 域名，通常最省心）
  - 推送失败时，请优先安装/启用 Git Credential Manager，用浏览器登录一次即可
#>

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

Write-Host ""
Write-Host "== [1/4] 清理 Git 代理（避免误指向 127.0.0.1:7890/443） ==" -ForegroundColor Cyan
foreach ($scope in @("global", "local")) {
  foreach ($k in @("http.proxy", "https.proxy", "http.https://github.com.proxy")) {
    git config --$scope --unset-all $k 2>$null
  }
}

Write-Host ""
Write-Host "== [2/4] 推荐凭据管理器（首次推送会弹浏览器登录） ==" -ForegroundColor Cyan
# Git for Windows 通常自带 manager；没有也不致命
# Windows 推荐 manager-core（Git for Windows 自带）；若已配置可忽略报错
git config --global credential.helper manager-core 2>$null
if ($LASTEXITCODE -ne 0) {
  git config --global credential.helper manager 2>$null
}

Write-Host ""
Write-Host "== [3/4] 将 origin 设为 HTTPS（仓库：zackpalumbi789-boop/personal_website） ==" -ForegroundColor Cyan
$httpsUrl = "https://github.com/zackpalumbi789-boop/personal_website.git"
$hasOrigin = git remote 2>$null | Where-Object { $_ -eq "origin" }
if ($hasOrigin) {
  git remote set-url origin $httpsUrl
} else {
  git remote add origin $httpsUrl
}
git remote -v

Write-Host ""
Write-Host "== [4/4] 推送当前分支到 origin ==" -ForegroundColor Cyan
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "当前分支: $branch"
git push -u origin $branch

Write-Host ""
Write-Host "完成。若提示输入密码，请使用 GitHub Personal Access Token（不是账户密码）。" -ForegroundColor Green
