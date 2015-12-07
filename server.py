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
    
    '''TODO'''
    processed_trips = raw_trips 
    
    
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


@app.route('/email', methods=['POST'])
def email():
    name = 'Catherine'
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

@app.route("/")
def main():
    return render_template('index.html', name='hello')

if __name__ == "__main__":
    app.run(debug=True)
