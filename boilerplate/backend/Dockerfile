FROM node:6.9.0

MAINTAINER Twitch Interactive, Inc.

# Install the npm packages which change infrequently
RUN mkdir -p /boilerplate/backend
WORKDIR /boilerplate/backend
COPY ./package.json /boilerplate/backend/
COPY ./credentials /boilerplate/backend/
RUN npm install supervisor -g
RUN npm install body-parser -g
RUN npm install aws-sdk -g
RUN npm install

# RUN export AWS_ACCESS_KEY_ID=$(aws --profile default configure get aws_access_key_id)
# RUN export AWS_SECRET_ACCESS_KEY=$(aws --profile default configure get aws_secret_access_key)

EXPOSE 8080
CMD ["./entrypoint.sh"]
# CMD [ "npm", "start" ]