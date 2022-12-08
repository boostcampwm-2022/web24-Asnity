# node 18 알파인 이미지 사용
FROM node:18-alpine

MAINTAINER NayoungKwon

# 환경변수 설정
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

# yarn 설치
#RUN npm install -g yarn

# 작업 디렉토리 생성
WORKDIR /apps

# 의존성 설치
COPY /package*.json ./
COPY /tsconfig.json ./
COPY /yarn.lock ./

COPY /shared/package*.json ./shared/
COPY /shared/tsconfig.json ./shared/

COPY /server/package*.json ./server/
COPY /server/tsconfig.json ./server/
RUN yarn

# 소스 추가
#RUN cd /..
COPY /. .

# Port mapping
EXPOSE 8080

# api server 실행
CMD ["yarn" , "socket-prod"]
