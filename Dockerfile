# Dockerfile wrapper - aponta para backend/Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml do backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código-fonte do backend
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Imagem de produção
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]