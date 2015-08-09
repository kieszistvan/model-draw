MAINTAINER Istvan Kiesz <istvan.kiesz@gmail.com>

FROM node:0.12-wheezy

ENV PORT 3000

EXPOSE 3000

ADD ./dist /app

WORKDIR /app

RUN npm install

RUN npm run-script gulp

CMD ["npm", "start"]
