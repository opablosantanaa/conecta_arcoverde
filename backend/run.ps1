# ============================================
# Conecta Arcoverde - Iniciar Backend
# ============================================
# Este script carrega as variáveis do .env
# e inicia o Spring Boot.

$envFilePath = Join-Path $PSScriptRoot ".env"

if (-not (Test-Path $envFilePath)) {
    Write-Host "ERRO: Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Copie .env.example para .env e preencha os valores." -ForegroundColor Yellow
    exit 1
}

Write-Host "Carregando variáveis de ambiente..." -ForegroundColor Cyan

# Ler e exportar variáveis do .env
Get-Content $envFilePath | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "  $key = [carregado]" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Iniciando Spring Boot..." -ForegroundColor Green
Write-Host "Porta: $env:SERVER_PORT" -ForegroundColor Gray
Write-Host "Banco: $env:DB_HOST`:$env:DB_PORT/$env:DB_NAME" -ForegroundColor Gray
Write-Host ""

# Iniciar o Spring Boot
Set-Location $PSScriptRoot
mvn spring-boot:run