@echo off
title Iniciando servidor Express...
cd /d "%~dp0"

:: Inicia el servidor Express (ajusta si usas otro archivo o pm2/nodemon)
start cmd /k "node app.js"

:: Espera unos segundos para asegurar que el servidor arranque
timeout /t 3 >nul

:: Abre el navegador predeterminado en localhost:3000
start http://localhost:3000
