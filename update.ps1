Set-Location $PSScriptRoot
hexo.cmd clean
hexo.cmd generate
git add -A
$now = (Get-Date).ToString("s")
git commit -m $now
git push