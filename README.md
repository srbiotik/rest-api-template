# RESTful API - Node.js Template

#### Dependencies

- Docker
- docker-compose
- git

### Usage

- Open terminal
- Clone the repository
- Cd the repository directory
- run command `touch .env`, in this env file you need to configure several env variables
	* PORT 	- the port on which the service should listen
	* SECRET_KEY      	- used to encrypt a part of the JWT token
	* TOKEN_EXIPIRES_IN - expiriation time of token default is two hours
	* WHITELIST         - a list of domains not succeptable to CORS, in the form of: www.somedomain.com,www.someother.com
	* EMAIL_SERVICE     - smtp server for distributing mail notifications
	* EMAIL_PORT 	    - port for the smtp server
	* EMAIL_USER 	    - user of smtp server
	* EMAIL_PASSWORD    - password for smtp server
- run command `docker-compose up -d` to start the service and `docker-compose down -d` to stop it
- once running you can check the endpoint documentation at 'http://localhost:${PORT}/docs'

### Tests

You need a running MongoDB to run the tests, since the testing has a seeding pre script `test-setup.js`. The connection details for the DB can also be setup inside this file, and they reside in the URL constant.
Once the connection is setup simply run the tests wiht `npm test` command.
The dump of the seed can bee located inside the dump folder in the root of the repository, which you can restore to do integration testing, examples of these can be seen at `/docs` route once the app is running
