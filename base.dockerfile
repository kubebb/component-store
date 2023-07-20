# dockerfile of base image
FROM --platform=linux/amd64 node:18.16-alpine

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache bash git openssh

# Create app directory
RUN mkdir -p /usr/src/app/packages/bff-server
RUN mkdir -p /usr/src/app/packages/portal
WORKDIR /usr/src/app

# Install dependencies modules
COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/
COPY pnpm-workspace.yaml /usr/src/app/
COPY .npmrc /usr/src/app/
COPY packages/bff-server/package.json /usr/src/app/packages/bff-server
COPY packages/portal/package.json /usr/src/app/packages/portal

ARG _authToken

RUN npm set //dev-npm.tenxcloud.net/:_authToken="${_authToken}" \
  && npm i pnpm @antfu/ni -g \
  && ni
