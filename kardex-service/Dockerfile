FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M5.jar
ENTRYPOINT ["java","-jar","/M5.jar"]