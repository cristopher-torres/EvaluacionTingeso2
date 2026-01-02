FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M6.jar
ENTRYPOINT ["java","-jar","/M6.jar"]