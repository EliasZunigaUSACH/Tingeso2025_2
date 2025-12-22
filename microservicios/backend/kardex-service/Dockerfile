FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} kardex-service.jar
ENTRYPOINT ["java", "-jar", "/kardex-service.jar"]