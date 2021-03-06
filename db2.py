'''
Created on Nov 7, 2015
@author: catzhangy2
'''
import psycopg2
from sqlalchemy.ext.baked import Result


def connect_db():
    db = psycopg2.connect(
        database='316',
        user='catzhangy1',
#         password='postgres',
        port='5432',
        host='localhost',
    )
    return db

# Don't call this. The database ia already set-up at this point.
def reset_tables(db):
    if db:
        try:
            db.cursor().execute(
                open("schema.sql", "r").read(),
            )
            db.commit()
            print "Successfully reset tables."
        except:
            print "Failed to reset tables."


# Add entries into database. Must be well-formed.

def get_user(db,user):
    if user:
        q = "SELECT * FROM Users WHERE username = \'" + user.get('username') + "\' AND password = \'" + user.get('password') + "\'" + ";"
        result = query(db,q)
        print result
        if len(result) == 0:
            return "False"
        return "True"

# yayayayay shit code
def insert_user(db, user):
    if db and user:
        try:
            c = db.cursor()
            c.execute(
                """INSERT INTO Users (username, name, password, email) VALUES (%s,%s, %s,%s);""",(user.get('username'), user.get('name'),user.get('password'), user.get('email'),))
            db.commit()
            print "Successfully inserted entries into Users." 
            return True
        except:
            print "Failed to insert entries into Users."
            return False

def insert_attraction(db, attraction, table):
    if db and attraction:
        try:
            print "*****"
            
            c = db.cursor()
            c.execute(
                """INSERT INTO Attractions(id,name,category,phone,address,longitude,latitude,imageurl) VALUES
    (%s,%s,%s,%s,%s,%s,%s,%s);""",(attraction.get('id'), attraction.get('name'),attraction.get('category'),attraction.get('phone'),attraction.get('address'),attraction.get('longitude'),attraction.get('latitude'),attraction.get('imageurl'),))
            db.commit()
            
            print "Successfully inserted entries into %s." % table
        except:
            print "Failed to insert entries into %s." % table



def insert_trip(db, trip, table):
    if db :
        try:
            print "*****"
            c = db.cursor()
            
            c.execute(
    #             """INSERT INTO Trips(attractionID, tstamp, userID,origin,destination) VALUES
    # ('statue-of-liberty-new-york-3','Sun Dec 06 2015 00:36:09 GMT-0500 (EST)','tn52','TRUE','FALSE');""",)
                """INSERT INTO Trips(attractionID, tstamp, userID,origin,destination,name) VALUES
    (%s,%s,%s,%s,%s,%s);""",
    (trip.get('attractionID'),trip.get('tstamp'),trip.get('userID'),trip.get('origin'),trip.get('destination'),trip.get('name')))
                # """INSERT INTO Trips(attractionID, tstamp, userID) VALUES ('statue-of-liberty-new-york-555','Sun Dec 06 2015 00:36:09 GMT-0500 (EST)','tn52'))""",)
            db.commit()

            print "Successfully inserted entries into %s." % table
        except:
            print "Failed to insert entries into %s." % table



# Arbitrary query from database
def query(db, query):
    if db and query:
        try:
            cur = db.cursor()
            cur.execute(query)
            return cur.fetchall()
        except:
            print "Failed to execute query."
            return []
    return []


# Takes a mapping of fields, converts to a query, and executes
def field_query(db, fields, table):
    if not fields:
        return query(
            db,
            "SELECT * FROM Trips ORDER BY tstamp",
        )
    else:
        # FIX POTENTIAL SQL INJECTION #
        return query(
            db,
            ''.join([
                "SELECT * FROM %s WHERE " % table,
                ' AND '.join(
                    ["%s = %s" % (f[0], f[1]) for f in fields.items()],
                ),
            ]),
        )

def get_history(db,userID):
    if userID:
        q = "SELECT tstamp FROM Trips WHERE userID = \'" + userID + "\'" + " GROUP BY tstamp;"
        unique_tstamps = query(db,q)
        dic = []
        i = 0
        for s in unique_tstamps:
            q = "SELECT * FROM Trips WHERE userID = \'" + userID + "\'" + " AND tstamp = \'" + s[0] + "\'" + ";"
#             print query(db,q)
            dic.append(query(db,q))
        return dic