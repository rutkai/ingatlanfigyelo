Ingatlanfigyelő
===============

Parsers:

* Ingatlan.com
* Otthonterkep.hu

Development
-----------

### Installation

In both project root and `frontend` directories:

    npm install
    
Build the frontend using

    npm build

in `frontend` directory.

### Running

Running polling server only:

     npm run start-polling

Running web server only:

     npm run start-web
     
Production
----------

### Docker (obsolete)

Running in docker:

    docker-compose run --publish 3000:3000 web

### Manual setup

> Install dir in this guide: `/srv`

1. Install mongodb, nodejs, and nginx (set mongodb autostart: `sudo systemctl enable mongod.service`)
2. Add database alias to `/etc/hosts`

       127.0.0.1       mongo

3. Add user for server processes

       sudo useradd -d /srv/ingatlanfigyelo -rU ingatlanfigyelo

4. Deploy application

       cd /srv 
       git clone https://riskawarrior@bitbucket.org/riskawarrior/ingatlanfigyelo.git ingatlanfigyelo
       cd ingatlanfigyelo
       npm install
       cd frontend
       npm install
       npm run build-prod

5. Set up nginx redirection by adding [this config](docs/nginx.conf) and restarting nginx
6. Set up polling server systemd by copying [the service config](docs/ingatlanfigyelo-polling.service) to `/etc/systemd/system/`
6. Set up web server systemd by copying [the service config](docs/ingatlanfigyelo-web.service) to `/etc/systemd/system/`
7. Re-start everything

       sudo service nginx restart
       sudo systemctl enable ingatlanfigyelo-polling
       sudo systemctl enable ingatlanfigyelo-web
       sudo systemctl start ingatlanfigyelo-polling
       sudo systemctl start ingatlanfigyelo-web
