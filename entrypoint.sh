#!/bin/bash

if [[ ! -d "/var/log/VDI/APP" ]]; then
    mkdir -p /var/log/VDI/APP
    touch /var/log/VDI/APP/access.log
    touch /var/log/VDI/APP/error.log
    touch /var/log/VDI/APP/app-flask.log
fi


gunicorn --access-logfile /var/log/VDI/APP/access.log --error-logfile /var/log/VDI/APP/error.log --workers 3 --bind 0.0.0.0:5000 docker:app