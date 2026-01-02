FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M3.jar
ENTRYPOINT ["java","-jar","/M3.jar"]