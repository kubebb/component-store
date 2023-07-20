#!/bin/bash
set -e

# build base image
base_image="172.22.96.119/front-end/component-store:base-0.1"
docker build --build-arg _authToken=$1 -t ${base_image} -f base.dockerfile .
docker push ${base_image}

# build prod base image
base_image_prod="172.22.96.119/front-end/component-store:base-0.1-prod"
docker build --build-arg _authToken=$1 -t ${base_image_prod} -f pro.dockerfile .
docker push ${base_image_prod}
