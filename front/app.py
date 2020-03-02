from flask import Flask, render_template
from requests import request
import socket

app = Flask(__name__)

@app.route('/')
def get():
    return render_template("home.html")

@app.route('/graphique/<string:id_station>')
def getGraphique(id_station):
    return render_template("home.html", id_station=id_station)

if __name__ == '__main__':
    app.run(debug=True)
