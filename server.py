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
from random import randint

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

    return "success"

@app.route("/")
def main():
    return render_template('index.html', name='hello')

if __name__ == "__main__":
    app.run(debug=True)
