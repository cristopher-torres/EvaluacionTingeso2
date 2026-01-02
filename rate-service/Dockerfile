FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M4.jar
ENTRYPOINT ["java","-jar","/M4.jar"]