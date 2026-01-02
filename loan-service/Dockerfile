FROM eclipse-temurin:17-jdk
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} M2.jar
ENTRYPOINT ["java","-jar","/M2.jar"]