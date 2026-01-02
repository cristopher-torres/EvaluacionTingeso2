FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M1.jar
ENTRYPOINT ["java","-jar","/M1.jar"]