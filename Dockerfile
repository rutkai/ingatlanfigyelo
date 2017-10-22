FROM node:8

WORKDIR /srv

ENV NODE_ENV=production

COPY . /srv
RUN cd /srv; npm install
RUN cd /srv/frontend; npm install; npm build

EXPOSE 3000
CMD ["npm", "start"]
