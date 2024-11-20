# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:16.17-alpine3.15

ADD . /app
# Create and change to the app directory.
WORKDIR /app

# Copy the file from your host to your current location.



# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
# COPY * ./

# Install production dependencies.
RUN npm install && npm install typescript -g
COPY . .
RUN tsc

RUN ls
# RUN NODE_ENV=production node_modules/.bin/sequelize db:migrate

EXPOSE 8080

# Copy local code to the container image.
# COPY . ./

# Run the web service on container startup.
CMD [ "npm", "start" ]

#Mac M1 commands
#docker buildx create --name mybuilder
# docker buildx use mybuilder
#docker buildx inspect --bootstrap

#docker buildx build --push --tag gcr.io/caramel-world-255706/q-api --platform=linux/amd64 .
# docker buildx build --push -t 918652970703.dkr.ecr.us-east-1.amazonaws.com/q-app-api --platform=linux/amd64 .

# docker buildx build --push -t 918652970703.dkr.ecr.us-east-1.amazonaws.com/q-app-api-dev --platform=linux/amd64 .
