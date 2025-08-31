@echo off
:: Define o caminho completo do arquivo login.html dentro da subpasta HTML
set "path_to_login=%~dp0HTML\login.html"

:: Verifica se o arquivo existe
if exist "%path_to_login%" (
    start "" "%path_to_login%"
) else (
    echo O arquivo login.html nao foi encontrado na pasta \HTML dentro de \MVP-FrontEnd.
    pause
)
