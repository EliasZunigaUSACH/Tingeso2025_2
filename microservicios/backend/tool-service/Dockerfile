FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} tool-service.jar
ENTRYPOINT ["java", "-jar", "/tool-service.jar"]