# base image
FROM node:17.8.0

# set working directory
WORKDIR /app

# copy the package.json and package-lock.json
COPY ./app .

# install dependencies
RUN npm install

# build the app and start
RUN ["npm" ,"run" ,"build"]

# expose port 3000
EXPOSE 3000
CMD ["npm", "start"]
