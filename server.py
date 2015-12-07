'''
Created on Oct 10, 2015

@author: catzhangy1
'''
import db2
import ast
import notify
import yelp
from flask import Flask, render_template, flash, redirect, url_for, Blueprint, request, g
import json
import os
import requests
import urllib
import base64
import collections
from random import randint
import datetime
import smtplib


'''Configuring local Postgres Database on Shell
postgres -D /usr/local/var/postgres -- starts up postgrespo
createuser admin -- create admin user
createdb -U admin testdb'''

app = Flask(__name__)

@app.route('/search-old', methods=['GET'])
def testMethod3():
    return db2.flask_field_query(db2.connect_db())

@app.route('/notify', methods=['POST'])
def emailSO():
    data = ast.literal_eval(request.data)
    print data;
    print data[0];
    print data[1];
    print data[2];
    notify.funtimes(db2.connect_db(), data[1], data[2], data[0])
    return 'success'

@app.route('/subscribe', methods=['POST'])
def subscribe():
    data = ast.literal_eval(request.data)
    db = db2.connect_db()
    db2.insert_into_db(db, [tuple(data)], "contact_list")
    return 'success'    

@app.route('/admin', methods=['POST'])
def admin():
    data = ast.literal_eval(request.data)
    db = db2.connect_db()
    db2.insert_into_db(db, [tuple(data)])
    # Check mailing list
    notify.send_emails(db, [tuple(data)])
    return 'success'

@app.route('/search', methods=['POST'])
def search():
    temp_search = []
    results_search = []
    data = ast.literal_eval(request.data)

    location = data[0].split("*")
    destination = data[1].split('*')
    activities = data[2].split('*')


    final_dest_num = int(data[3]) - len(destination)
    for loc in location:
            for dest in destination:
                results_search.append(yelp.query_api(dest,loc))
    if (final_dest_num > 0):
        for loc in location:
            for act in activities:
                temp_search.append(yelp.query_api(act,loc))
    while final_dest_num >0:
        n = randint(0,len(temp_search)-1)
        results_search.append(temp_search[n])
        final_dest_num =- 1
    return json.dumps(results_search)


@app.route('/save', methods=['POST'])
def save():
    '''add save trip method: for now request data dosn't have user's ID, just hardcode one'''
    data = ast.literal_eval(request.data)

    db = db2.connect_db()
    db1 = db2.connect_db()

    tstamp = "str(10)"
    userID= "wkc10"
    # null check
    # attraction
    for i in range(len(data)):
        attraction = data[i]
        origin = "FALSE"
        destination = "FALSE"
        if i == 0:
            origin = "TRUE"
        if i == (len(data) - 1):
            destination = "TRUE"
        tstamp+=str(i)
        trip = {
            'attractionID': attraction.get('id'),
            'tstamp': tstamp,
            'userID': userID,
            'origin': origin,
            'destination': destination,
        }

        
        db2.insert_attraction(db, attraction, "Attractions")
        db2.insert_trip(db1, trip, "Trips")

    # skip trip directory for now
    return "success"

# this assumes passed back 'userID'
@app.route("/History")
def getTripHistory():
    data = ast.literal_eval(request.data)
    userID = data
    db = db2.connect_db()
    raw_trips = db2.get_history(db,userID)
    return processed_trips


@app.route("/login",methods=['POST'])
def login():
    data = ast.literal_eval(request.data)
    user = data[0]
    db = db2.connect_db()
    return str(db2.get_user(db,user))

@app.route('/register',methods=['POST'])
def register():
    data = ast.literal_eval(request.data)
    user = data[0]
    db = db2.connect_db()
    return str(db2.insert_user(db,user))


@app.route("/")
def main():
    return render_template('index.html', name='hello')

if __name__ == "__main__":
    app.run(debug=True)
