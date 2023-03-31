# base image
FROM node:17.8.0

# set working directory
WORKDIR /app

COPY ./app .

# install dependencies
RUN npm install

# expose port 3000
EXPOSE 3000

# start the app
CMD ["npm", "run", "build"]
CMD ["npm", "start"]
