from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import json
import mysql.connector
from decimal import *

#Datenbank Zugangsdaten
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="MaStri.05",
  database="news"
)

#Hilfsklasse für Decimal Variablen
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        # 👇️ if passed in object is instance of Decimal
        # convert it to a string
        if isinstance(obj, Decimal):
            return str(obj)
        # 👇️ otherwise use the default behavior
        return json.JSONEncoder.default(self, obj)

#Flask App - Initialisierung
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return redirect(url_for('articles'))


@app.route("/articles", methods = ['GET'])
def products():
    mycursor = mydb.cursor()
    sqlQuery = "SELECT * FROM article"
    mycursor.execute(sqlQuery)

    return mycursor.fetchall()


@app.route('/article/<product>',methods = ['GET'])
def productDetail(product):
    mycursor = mydb.cursor()
    sqlQuery = "SELECT * FROM article WHERE ID_Article = '" + product + "'"
    mycursor.execute(sqlQuery)
    myresult = mycursor.fetchall()
    myresult = json.dumps(myresult, cls=DecimalEncoder)
    print(myresult)
    return myresult


@app.route('/products',methods = ['POST', 'OPTIONS', 'PUT'])
def addProduct():
    data = request.data
    data = json.loads(data)
    #print(data)
    mycursor = mydb.cursor()
    if data['id'] != "":
        sql = "UPDATE article SET Bezeichnung = '" + data['description'] +"', E_Preis = '" + data['e_price'] +"', V_Preis = '" + data['v_price'] +"', Anzahl = '" + data['amount'] +"' WHERE ID_Produkt = '" + data['id'] + "'"
        mycursor.execute(sql)
    else:
        sql = "INSERT INTO article (Bezeichnung, E_Preis, V_Preis, Anzahl) VALUES (%s, %s, %s, %s)"
        val = (data['description'], data['e_price'], data['v_price'], data['amount'])
        mycursor.execute(sql, val)
    print(mydb.commit())
    return "Success"


@app.route('/article/<id>',methods = ['DELETE'])
def deleteProduct(id):
    #print(id)
    mycursor = mydb.cursor()
    sql = "DELETE FROM article WHERE ID_Article = '" + id + "'"
    mycursor.execute(sql)
    #print(mydb.commit())
    return "Success"


if __name__ == '__main__':
   app.run(debug = True)