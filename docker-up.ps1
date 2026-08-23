# ============================================
# Conecta Arcoverde - Iniciar MySQL (Docker)
# ============================================

$envFilePath = Join-Path $PSScriptRoot "backend\.env"

if (-not (Test-Path $envFilePath)) {
    Write-Host "ERRO: Arquivo backend\.env não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Carregando variáveis do .env..." -ForegroundColor Cyan

# Ler variáveis do .env
Get-Content $envFilePath | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

Write-Host "Iniciando MySQL na porta $env:DB_PORT..." -ForegroundColor Green
docker compose up -d

Write-Host ""
Write-Host "Aguardando MySQL inicializar..." -ForegroundColor Cyan
Start-Sleep -Seconds 20

Write-Host "MySQL pronto!" -ForegroundColor Green
Write-Host "Conexão: localhost:$env:DB_PORT" -ForegroundColor Gray