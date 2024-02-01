# APP VDI

## Description
This the fronted of the APP VDI. You can find the API [here](https://github.com/AlexTheGeek/api-vdi).

## Installation
### Requirements
1. Linux : Ubuntu 20.04, Debian 11,12
2. Python 3.11.2
3. Pip or Pipx : you can even create a virtual environment to run those scripts
4. Create a user vdi with the home directory `/home/vdi`
5. Create a folder `/home/vdi/VDI-APP` for the API and and clone this repository in it  
    5.1. `mkdir -p /home/vdi/VDI-APP`  
    5.2. `cd /home/vdi/VDI-APP`  
    5.3. `git clone https://github.com/loimax/vdi.git`  
6. Install the requirements : `pip install -r requirements.txt`
7. Create a folder /var/log/VDI/API for the logs of the API : `mkdir -p /var/log/VDI/APP`  
    7.1. Set the rights of the user who runs the API (here vdi) on this folder : `chown -R vdi:vdi /var/log/VDI/APP`  

### Docker
1. build the image : `docker build -t vdi-app .` or `docker-compose build` with the docker-compose.yml file
2. run the container : `docker run -it -d -p 5000:5000 --name vdi-app vdi-app` or `docker-compose up -d` with the docker-compose.yml file
```yaml
version: "3.9"
services:
  vdi-app:
    #build: .
    image: vdi-app
    container_name: vdi-app
    ports:
        - "5000:5000"
    environment:
        - URL_API="https://api.insa-cvl.com/"
    restart: always
```	
3. check the logs : `docker logs vdi-app` or `docker-compose logs -f`


### Systemd 
1. Create a file `/etc/systemd/system/vdi-app.service` with the following content :  
    ```
    [Unit]
    Description=Gunicorn instance to serve APP VDI
    After=network.target

    [Service]
    User=vdi
    Group=vdi
    WorkingDirectory=/home/vdi/VDI-APP
    Environment="PATH=/home/vdi/.local/bin"
    ExecStart=/home/vdi/.local/bin/gunicorn --access-logfile /var/log/VDI/APP/access.log --error-logfile /var/log/VDI/APP/error.log --workers 3 --bind 0.0.0.0:5000 app:app

    [Install]
    WantedBy=multi-user.target
    ``` 
2. Reload the systemd daemon : `systemctl daemon-reload`
3. Enable the service : `systemctl enable vdi-app.service`
4. Start the service : `systemctl start vdi-app.service`
5. Check the status of the service : `systemctl status vdi-app.service`
