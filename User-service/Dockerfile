FROM eclipse-temurin:17-jdk
ARG JAR_FILE=target/toolrent-backend.jar
COPY ${JAR_FILE} toolrent-backend.jar
EXPOSE 8090
ENTRYPOINT ["java","-jar","/toolrent-backend.jar"]