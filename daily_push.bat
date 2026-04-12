@echo off

cd /d "%USERPROFILE%\Desktop\Learn Node\doc-vault-2"

:: Create/update a log file so there's always a change
echo %date% %time% >> activity.log

git add .
git commit -m "Daily auto commit"
git push origin master
