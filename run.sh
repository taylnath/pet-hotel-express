#!/bin/bash

source ./venv/bin/activate

gunicorn --bind 0.0.0.0:42001 wsgi:app -D --capture-output --log-file app.log --log-level 'debug'
