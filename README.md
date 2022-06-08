## Running Kafka

```bash
$ export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
$ docker-compose -f kafka.yml up -d
```

## Create Database

```bash
$ docker network create microservices
$ docker-compose -f database.yml up -d
```

## Run services

```bash
# read README file in each service and configure .env file
$ cd project-name
$ npm install
```
