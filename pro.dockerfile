FROM --platform=linux/amd64 node:18.16-alpine
LABEL maintainer="zhangpc<zhangpc@tenxcloud.com>"

# Create app directory
RUN mkdir -p /usr/src/app/packages/bff-server
WORKDIR  /usr/src/app/packages/bff-server

# Set env
ENV NODE_ENV production

# Install dependencies modules
COPY package.json /usr/src/app/
COPY pnpm-lock.yaml /usr/src/app/
COPY pnpm-workspace.yaml /usr/src/app/
COPY .npmrc /usr/src/app/
COPY packages/bff-server/package.json /usr/src/app/packages/bff-server

ARG _authToken

RUN npm set //dev-npm.tenxcloud.net/:_authToken="${_authToken}" \
  && npm i pnpm @antfu/ni -g \
  && ni --ignore-scripts
