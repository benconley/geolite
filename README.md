# geolite
Author: [Ben Conley](http://benconley.net/)

geolite is a simple nodeJS application to retrieve and map Internet address information using geographical coordinates.
#### Table of Contents
* [Functionality](#Functionality)
* [Installation](#Installation)
    * [Data Configuration](#Data)
    * [Code Configuration](#Code)
    * [Render](#Render)
* [Logging](#Logging)
* [Linting](#Linting)
* [Testing](#Testing)
* [To Do List](#Todo)
#### Functionality
  * Define a geographic coordinate bounding box using dragging/zooming on a mapping component
  * Submit bounding box corners to API
  * Retrieve coordinates and address information contained withing the bounding box
  * Plot coordinates on mapping component

![Application Screenshot](http://teamshocker.com/pics/dev/geolite_heatmap_image.png)
[Example installation](http://ec2-54-69-77-46.us-west-2.compute.amazonaws.com:3000/) exists on AWS. Contact me if you want to demo it because the instance is not running all the time
#### Installation
##### Data
##### Create database for application use
```sql
CREATE DATABASE geolite
```
*Now create user and either set permissions at database level or on individual tables/views once created*
##### Define table to store IPv4 information
```sql
CREATE TABLE `geolite`.`blocks_ipv4` (
	`network` VARCHAR(50),
	`geoname_id` INT unsigned,
	`registered_country_geoname_id` INT unsigned,
	`represented_country_geoname_id` INT unsigned,
	`is_anonymous_proxy` BOOLEAN NULL,
	`is_satellite_provider` BOOLEAN NULL,
	`postal_code` VARCHAR(10),
	`latitude` DECIMAL(7,4),
	`longitude` DECIMAL(7,4),
	`accuracy_radius` INT unsigned
	PRIMARY KEY (`id`),
	INDEX `lat` (`latitude`),
	INDEX `long` (`longitude`)
) COMMENT 'ipv4 blocks'
ENGINE=INNODB DEFAULT CHARSET=latin1;
```
##### Create view for concise data used on heatmap
```sql
CREATE OR REPLACE VIEW `geolite`.`blocks_ipv4_concise` AS
SELECT network, longitude, latitude FROM `geolite`.`blocks_ipv4`;
```
##### Retrieve data from source and populate data store
```sh
$ wget http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip
$ unzip http://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip
$ cd GeoLite2-City-CSV
$ mv GeoLite2-City-Blocks-IPv4.csv blocks_ipv4.csv
$ mysqlimport --ignore-lines=1 --lines-terminated-by='\n' --fields-terminated-by=',' --fields-enclosed-by='"' --verbose --local -hDB_HOST_GEOLITE -uDB_USER_GEOLITE -p geolite blocks_ipv4.csv
```
##### Code
repoViewer requires [Node.js](https://nodejs.org/) to run.
Clone the repoViewer repository from [GitHub](https://github.com/benconley)
```sh
git clone https://github.com/benconley/geolite.git
```
Set ENV variables, or copy sample .env file and edit as desired
```
$ cd geolite
$ cp .env.example .env
$ vim .env

    *or*

$ NODE_ENV=development [production] node app
$ LOG_FORMAT=dev [prod]
$ DB_HOST_GEOLITE=XXX
$ DB_USER_GEOLITE=XXX
$ DB_PASS_GEOLITE=XXX
$ DB_NAME_GEOLITE=geolite
$ DB_PORT_GEOLITE=3306
```
Install the dependencies and devDependencies and start the server.
```
$ npm install
$ npm run start
```
##### Render
Site is set up to run on port 3000 at the base route by default. This can be customized in the environment setup and routes/routes.js
[http://localhost:3000](http://localhost:3000)

#### Logging
Logger feature prints to stdout for consumption by Elastic Stack or similiar tooling. Environment settings will determine color formatting for logger
Example output:
```
::1 - - [08/Sep/2019:11:52:18 +0000] "GET / HTTP/1.1" 200 2800 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"

::1 - - [08/Sep/2019:11:52:34 +0000] "GET /getIpsByBoundaryBox?latArr%5B%5D=35.83093683842937&latArr%5B%5D=35.6637522928614&longArr%5B%5D=-78.33293247262382&longArr%5B%5D=-78.85134983102226 HTTP/1.1" 200 179972 "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
```
#### Linting
```sh
$ npm run lint
$ npm run lint-fix
```
#### Testing
##### Unit Tests
```
ben [~/dev/geolite]$ npm run test

> geolite@1.0.0 test /Users/ben/dev/geolite
> jest

 PASS  helpers/error_helper.spec.js
 PASS  logger/logger.spec.js
 PASS  controllers/blocks/blocks.spec.js
 PASS  models/Blocks/Blocks.spec.js

Test Suites: 4 passed, 4 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        1.701s, estimated 2s
Ran all test suites.
```
##### e2e Tests
```
ben [~/dev/geolite]$ npm run e2e

> geolite@1.0.0 e2e /Users/ben/dev/geolite
> jest --config=./jest.config.e2e.json --forceExit --detectOpenHandles --runInBand

 PASS  routes/routes.e2e.js
  /getIpsByBoundaryBox GET
    ✓ should return an array of network geolocations (258ms)

::ffff:127.0.0.1 - - [08/Sep/2019:12:21:24 +0000] "GET /getIpsByBoundaryBox?latArr[]=36.10092635302054&latArr[]=36.08011874560354&longArr[]=-78.87897578180763&longArr[]=-78.94124594629737 HTTP/1.1" 200 1036 "-" "node-superagent/3.8.3"
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.363s, estimated 5s
Ran all test suites.
```
#### Todo
* Support faster result renders with technology like protobufs
* Implement cache for result sets using something like Redis
* Support direct search functionality using addresses or typed coordinates
* Implement additional mapping styles beyond heatmap