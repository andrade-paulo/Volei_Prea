FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copia todos os arquivos do backend para dentro do container
COPY . .

# Garante que o wrapper do Maven tenha permissão de execução no Linux
RUN chmod +x ./mvnw

# Executa o build ignorando os testes para maior agilidade no MVP
RUN ./mvnw clean package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/voleiprea-0.0.1-SNAPSHOT.jar"]