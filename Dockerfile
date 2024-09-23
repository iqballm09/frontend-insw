# Use an official Node.js image as the base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# ENV
ENV NEXT_PUBLIC_API_URI=http://10.239.54.34:5000
ENV WEB_URI=http://10.239.54.34:3000

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build
# Expose the port the app runs on
EXPOSE 3000
CMD [ "npm", "run", "start" ]
