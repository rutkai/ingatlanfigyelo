FROM node:10

WORKDIR /srv

ENV NODE_ENV=production

COPY . /srv
RUN cd /srv; npm install

EXPOSE 3000
CMD ["npm", "start"]
