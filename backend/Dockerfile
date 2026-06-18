FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copia todos os arquivos do backend para dentro do container
COPY . .

# Garante que o wrapper do Maven tenha permissão de execução no Linux
RUN chmod +x ./mvnw

# Executa o build ignorando os testes para maior agilidade no MVP
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

# Executa o primeiro arquivo .jar que encontrar no diretório target
ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]