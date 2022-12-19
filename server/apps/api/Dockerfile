# node 18 알파인 이미지 사용
FROM node:18-alpine
MAINTAINER NayoungKwon
# 환경변수 설정
ARG MONGODB_URL
ENV MONGODB_URL ${MONGODB_URL}
ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}
ARG ERROR_SLACK_WEBHOOK
ENV ERROR_SLACK_WEBHOOK ${ERROR_SLACK_WEBHOOK}
ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET}
ARG REDIS_PORT
ENV REDIS_PORT ${REDIS_PORT}
ARG REDIS_PW
ENV REDIS_PW ${REDIS_PW}
ARG MONGODB_ATLAS
ENV MONGODB_ATLAS ${MONGODB_ATLAS}

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
COPY /. .

# Port mapping
EXPOSE 3001

# api server 실행
CMD ["yarn" , "api-prod"]