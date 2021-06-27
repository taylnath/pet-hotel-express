from flask import Flask
from routes.test import test as test_route

app = Flask(__name__)
app.register_blueprint(test_route, url_prefix="/test")

print(app.url_map) # debug