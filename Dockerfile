FROM node:0.12-wheezy

MAINTAINER Istvan Kiesz <istvan.kiesz@gmail.com>

ENV PORT 3000

EXPOSE 3000

ADD . /app

WORKDIR /app

RUN npm run-script gulp

CMD ["npm", "start"]
