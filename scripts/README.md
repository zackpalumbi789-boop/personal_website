# 同步到 GitHub（最简单）

双击或在项目根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1
```

**开着 Clash / VPN 有本机 HTTP 端口时**（终端直连 `github.com` 会超时），加上端口（在软件里看「HTTP 代理 / Mixed」是多少）：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1 -ProxyPort 7890
```

作用：按需设置代理 → 设置 HTTPS 远程 → `git push`。

首次若提示登录，用 **GitHub 账号在弹窗里登录**；若要求输入密码，填 **Personal Access Token**（在 GitHub → Settings → Developer settings → Personal access tokens 创建）。

---

仅把**本地已提交**的改动推上去。若还有未提交文件，请先：

```powershell
git add -A
git commit -m "你的说明"
```

再运行上面的脚本。
