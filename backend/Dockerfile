FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar Maven wrapper e pom.xml
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY backend/src src

# Build
RUN ./mvnw package -DskipTests

# Expor porta
EXPOSE 8080

# Executar aplicação
ENTRYPOINT ["java", "-jar", "target/ibank-system-2.0.0.jar"]
