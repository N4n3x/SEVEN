from flask import Flask, render_template
from requests import request
import socket

app = Flask(__name__)

@app.route('/')
def get():
    return render_template("home.html")

if __name__ == '__main__':
    app.run(debug=True)
