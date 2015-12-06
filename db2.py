'''
Created on Nov 7, 2015

@author: catzhangy2
'''
import psycopg2


def connect_db():
    # db = psycopg2.connect(
    #     database='jetblue',
    #     user='catzhangy1',
    #     port='5432',
    #     host='localhost',
    # )
    db = psycopg2.connect(
        database='316',
        user='postgres',
        password="postgres",
        port='5433',
        host='localhost',
    )
    return db


# Don't call this. The database ia already set-up at this point.
def reset_tables(db):
    if db:
        try:
            db.cursor().execute(
                open("schema2.sql", "r").read(),
            )
            db.commit()
            print "Successfully reset tables."
        except:
            print "Failed to reset tables."


# Add entries into database. Must be well-formed.
#order is switched
def insert_into_db(db, table,entries=[]):
    for shit in entries:
        print shit
    if db and entries:
        try:
            db.cursor().execute(
                "INSERT INTO %s VALUES %s" % (table, str(entries)[1:-1]),
            )
            db.commit()
            print "Successfully inserted entries into %s." % table
        except:
            print "Failed to insert entries."


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
def field_query(db, fields=[], table="jetblue_data"):
    if not fields:
        return query(
            db,
            "SELECT * FROM %s ORDER BY RANDOM() LIMIT 1" % table,
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


#Get all users
def field_query_all_users(db, table,fields=[],):
    if not fields:
        return query(
            db,
            "SELECT * FROM %s LIMIT 10" % table,
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

#Get attractions
def field_query_all_attractions(db, fields=[], table="Attractions"):
    if not fields:
        return query(
            db,
            "SELECT * FROM %s LIMIT 10" % table,
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

# Executes a Flask friendly query by returning a formatted string
def flask_field_query_user(db, fields=[], table="Users"):
    results = field_query(db, fields, table)
    return '@'.join(['*'.join([str(x) for x in y]) for y in results])
def flask_field_query_trip(db, fields=[], table="Trips"):
    results = field_query(db, fields, table)
    return '@'.join(['*'.join([str(x) for x in y]) for y in results])
def flask_field_query_attraction(db, fields=[], table="Attractions"):
    results = field_query(db, fields, table)
    return '@'.join(['*'.join([str(x) for x in y]) for y in results])
