from flask import Blueprint, Flask, render_template, json, abort
from jinja2 import TemplateNotFound
import os

# Configuration

#db_connection = db.connect_to_database()
def test(db):
  Blueprint('test', __name__, template_folder='../templates')

# Routes 
@test.route('/', defaults={'page': 'index'})
@test.route('/<page>')
def show(page):
  try:
    return render_template(f'{page}.jinja')
  except TemplateNotFound:
    abort(404)

# @app.route('/')
# def root():
#     return render_template("main.jinja")

# @app.route('/bsg-people')
# def bsg_people():
#     query = "SELECT * FROM bsg_people;"
#     cursor = db.execute_query(db_connection=db_connection, query=query)
#     results = cursor.fetchall()
#     return render_template("bsg.jinja", bsg_people=results)

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
