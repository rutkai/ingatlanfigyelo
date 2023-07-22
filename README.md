# Ingatlanfigyelő

Parsers:

* Ingatlan.com
* Jofogas.hu
* Oc.hu
* Otthonterkep.hu

## Development

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
     
## Production

### Docker

Running in docker:

    docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
