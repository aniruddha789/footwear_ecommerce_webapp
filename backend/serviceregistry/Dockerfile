# Start with a base image containing Java runtime
FROM openjdk:17-jdk-slim

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port 8761 available to the world outside this container
EXPOSE 8761

# The application's JAR file
ARG JAR_FILE=target/*.jar

# Add the application's JAR file to the container
ADD ${JAR_FILE} app.jar

# Run the JAR file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
