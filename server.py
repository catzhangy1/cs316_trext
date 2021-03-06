'''
Created on Oct 10, 2015

@author: catzhangy1
'''
import db2
import ast
import notify
import collections
import yelp
from flask import Flask, render_template, flash, redirect, url_for, Blueprint, request, g
import json
import os
import requests
import urllib
import base64
from random import randint
import datetime
import time

'''Configuring local Postgres Database on Shell
postgres -D /usr/local/var/postgres -- starts up postgrespo
createuser admin -- create admin user
createdb -U admin testdb'''

app = Flask(__name__)

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
                print "destination"
                print results_search
                results_search.append(yelp.query_api(dest,loc))
    if (final_dest_num > 0):
        for loc in location:
            for act in activities:
                print "hi"
                print temp_search
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
    userID = data[0]
    data = data[1:]
#     dt_obj = time.time()
#     tstamp = datetime.datetime.fromtimestamp(dt_obj).strftime('%Y-%m-%d %H:%M:%S')
    tstamp = str(datetime.datetime.now())
    
    for i in range(len(data)):
        parsed = data[i].split("*")
        attraction = {
            'id': parsed[0],
            'name': parsed[1],
            'category': parsed[2],
            'phone': parsed[3],
            'address': parsed[4],
            'longitude': parsed[5],
            'latitude': parsed[6],
            'imageurl': parsed[7],
        }
        print attraction
        trip = {
            'attractionID': parsed[0],
            'name': parsed[1],
            'tstamp' : tstamp,
            'userID': userID,
            'origin': parsed[8],
            'destination': parsed[9],
        }
        print "**"
        print trip
        db2.insert_attraction(db, attraction, "Attractions")
        db2.insert_trip(db1, trip, "Trips")

    # skip trip directory for now
    return "success"

@app.route("/login",methods=['POST'])
def login():
    data = ast.literal_eval(request.data)
    user = data[0]
    db = db2.connect_db()
    result = str(db2.get_user(db,user))
    if result == "True":
        return "Success"
    return "Fail"

@app.route('/register',methods=['POST'])
def register():
    data = ast.literal_eval(request.data)
    user = data[0]
    db = db2.connect_db()
    return str(db2.insert_user(db,user))


@app.route('/email', methods=['POST'])
def email():
    name = 'Catherine' ## default values for email :) 
    email = 'catzhangy1@gmail.com'
    start = 'Duke University'
    end = 'UNC Chapel Hill'
    data = ast.literal_eval(request.data)
    if(data[0]):
        name = data[0]
    if(data[1]):
        email = data[1]
    if(data[2]):
        start = data[2]
    if(data[3]):
        end = data[3]
    notify.sharetrip(name,email,start,end)
    return "emailed"

@app.route('/history/<username>', methods=['GET'])
def history(username):
    db = db2.connect_db()
    raw_trips = db2.get_history(db, username)
    
    all_trips = ""
    for trip in raw_trips:
        all_attractions = ""
        for list_attractions in trip:
            all_attractions += "@".join(list_attractions)
            all_attractions += "*"
        all_trips += all_attractions
        all_trips += "^"
    return all_trips
    
@app.route("/")
def main():
    return render_template('index.html', name='hello')

if __name__ == "__main__":
    app.run(debug=True)
