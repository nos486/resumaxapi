# base image
FROM node:17.8.0

# set working directory
WORKDIR /app

# copy the package.json and package-lock.json
COPY ./app/package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY ./app .

# expose port 3000
EXPOSE 3000

# start the app
CMD ["npm", "start"]
