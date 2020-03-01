from flask import Flask, render_template
from requests import request
import socket

app = Flask(__name__)
   
hostname = socket.gethostname()    
ipaddress = socket.gethostbyname(hostname)

@app.route('/')
def get():
    return render_template("home.html", ip=ipaddress)

if __name__ == '__main__':
    app.run(debug=True)