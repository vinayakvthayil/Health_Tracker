FROM --platform=linux/amd64 eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Install necessary tools
RUN apk add --no-cache curl tar

# Download and install Maven
RUN wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz && \
    tar -xzf apache-maven-3.9.6-bin.tar.gz -C /opt/ && \
    rm apache-maven-3.9.6-bin.tar.gz
ENV PATH="/opt/apache-maven-3.9.6/bin:${PATH}"

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/health-tracker-api-1.0.0.jar"] 