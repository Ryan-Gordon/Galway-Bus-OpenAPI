FROM node:8.x

# app directory
WORKDIR /home/node/app

# copy and install app dependencies
COPY package*.json ./

RUN yarn

# bundle app source
COPY . .

# Can probably change this
EXPOSE 9999 

CMD ["yarn", "run dev"]

