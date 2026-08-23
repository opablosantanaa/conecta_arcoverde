# ============================================
# Estágio 1: Build com Maven
# ============================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar apenas o pom.xml para aproveitar cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código-fonte e buildar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================
# Estágio 2: Imagem de produção (leve)
# ============================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar o JAR gerado
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta do Spring Boot
EXPOSE 8080

# Variável de ambiente para o Railway (PORT é fornecida automaticamente)
ENV JAVA_OPTS=""

# Inicia a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]