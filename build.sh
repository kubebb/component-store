#!/bin/bash
set -e

image="kubebb/component-store:latest"

# 1.构建基础镜像
./update_base_image.sh $1

# 2.构建静态文件镜像
docker build -t $image .

docker push $image
