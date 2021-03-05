### ⚙️ Setup

Install [Docker](https://www.docker.com/) and generate a (self-signed) PEM file :

`mkdir services/traefik/certs && cd services/traefik/certs`

`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.crt`

For Windows first make sure to setup shared files in your VM and mount them correctly.

Then update the volume paths in `docker-compose.yml`.

### 🚀 Run it

`docker-compose down`

`docker-compose build`

`docker-compose up`

Visit `https://DOCKER_NETWORK_IP`