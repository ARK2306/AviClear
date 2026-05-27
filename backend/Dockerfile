# ── Stage 1: Build ────────────────────────────────────────────
# Use Maven + JDK to compile and package the jar
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# so dependencies are only re-downloaded when pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: Run ──────────────────────────────────────────────
# Use slim JRE only — no build tools in production
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S aviclear && adduser -S aviclear -G aviclear
USER aviclear

# Copy only the jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]