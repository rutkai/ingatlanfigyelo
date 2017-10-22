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

###Running

Execute in the project root:

     npm start
     
Production
----------

Running in docker:

    docker-compose run --publish 3000:3000 web
