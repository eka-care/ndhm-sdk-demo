FROM mhart/alpine-node

WORKDIR /app

COPY . .
ENV TZ="Asia/Kolkata"

RUN yarn install
RUN yarn add sharp

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
