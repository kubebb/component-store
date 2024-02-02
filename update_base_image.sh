#!/bin/bash
set -e

# build base image
base_image="kubebb/component-store-base:main"
docker build --build-arg -t ${base_image} -f base.dockerfile .
docker push ${base_image}

# build prod base image
base_image_prod="kubebb/component-store-base-pro:main"
docker build --build-arg -t ${base_image_prod} -f pro.dockerfile .
docker push ${base_image_prod}
