FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} report-service.jar
ENTRYPOINT ["java", "-jar", "/report-service.jar"]