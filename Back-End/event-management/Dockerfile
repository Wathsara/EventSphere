FROM ballerina/ballerina:latest
LABEL maintainer="Wathsara Daluwatta"

ARG USER_HOME=/home/app
# Create app directory
WORKDIR ${USER_HOME}

# Set a non-root user
USER 10001

# Copy the rest of the application code to the container
COPY --chown=${USER}:${USER_GROUP} . .

# Expose port 3000
EXPOSE 8080

# Start the application
CMD ["bal", "run"]
