from flask import Flask, jsonify
from flask_restx import Resource, Api, fields,marshal
from pymongo import MongoClient
import json

app = Flask(__name__)
api = Api(app, version='1.0', title='Seven API', description='API de l\'exercice 7')
ns = api.namespace('weather', description='Weather operations')
client = MongoClient("mongodb://%s:%s@seven_mongo:27017" % ('root', 'example'))

db = client.weather
collection = db.temperature


temperature = api.model('Temperature', {
    # '_id' : fields.String(),
    'id_station' : fields.String(required=True, description='@MAC Station'),
    'id_sonde' : fields.String(required=True, description='@MAC Sonde'),
    'latitude' : fields.Float(required=True, description='Latitude'),
    'longitude' : fields.Float(required=True, description='Longitude'),
    'ville' : fields.String(required=True, description='ville'),
    'timestamp' : fields.Integer(required=True, description='Timestamp'),
    'temperature' : fields.Float(required=True, description='Temperature'),
    'humidite' : fields.Float(required=True, description='Humidite')
})


@ns.route('/temperature')
class TempList(Resource):
    @ns.doc('list_temperature')
    @ns.marshal_with(temperature, True)
    def get(self):
        data = collection.find({}, {"_id" : 0})
        data_parsed = []
        for x in data:
            data_parsed.append(x)
        print(data_parsed)
        # champs = {'data' : fields.List}
        return data_parsed

    @ns.doc('create_temperature')
    @ns.expect(temperature)
    @ns.marshal_with(temperature, code=201)
    def post(self):
        id_res = collection.insert_one(api.payload).inserted_id
        result = collection.find_one({"_id" : id_res}, {"_id" : 0})
        return result
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
    app.run(debug=True)