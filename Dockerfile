# Use Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jre

# Copy JAR file
COPY target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "/app.jar"]
