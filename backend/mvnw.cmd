@echo off
setlocal EnableDelayedExpansion

:: Add Windows standard system paths
set "PATH=%PATH%;C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Program Files\Java\jdk-17\bin;C:\Program Files\Java\jdk-21\bin"

set "DIRNAME=%~dp0"
set "MAVEN_VERSION=3.9.6"
set "MAVEN_DIR=%DIRNAME%.mvn\apache-maven-%MAVEN_VERSION%"
set "MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd"
set "MAVEN_ZIP=%DIRNAME%.mvn\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

if not exist "%MAVEN_CMD%" (
    if not exist "%DIRNAME%.mvn" (
        mkdir "%DIRNAME%.mvn"
    )

    if not exist "%MAVEN_ZIP%" (
        echo [INFO] Downloading Apache Maven %MAVEN_VERSION%...
        if exist "C:\Windows\System32\curl.exe" (
            C:\Windows\System32\curl.exe -fL -o "%MAVEN_ZIP%" "%MAVEN_URL%"
        ) else (
            C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%MAVEN_URL%', '%MAVEN_ZIP%')"
        )
    )

    if exist "%MAVEN_ZIP%" (
        echo [INFO] Extracting Apache Maven %MAVEN_VERSION%...
        if exist "C:\Windows\System32\tar.exe" (
            C:\Windows\System32\tar.exe -xf "%MAVEN_ZIP%" -C "%DIRNAME%.mvn"
        ) else (
            C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%DIRNAME%.mvn' -Force"
        )
        del "%MAVEN_ZIP%" 2>nul
    )
)

if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
    exit /b %ERRORLEVEL%
) else (
    echo [ERROR] Could not initialize Maven. Please verify your internet connection.
    exit /b 1
)
