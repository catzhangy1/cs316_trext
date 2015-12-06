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
        database='htencuzl',
        user='htencuzl',
        password='TSYmXOOWqoFMEQAx1lfRa3JZ2BbY-H6-',
        port='5432',
        host='pellefant-01.db.elephantsql.com',
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
def insert_into_db(db, entries=[], table="jetblue_data"):
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


# Executes a Flask friendly query by returning a formatted string
def flask_field_query(db, fields=[], table="jetblue_data"):
    results = field_query(db, fields, table)
    return '@'.join(['*'.join([str(x) for x in y]) for y in results])


# Populate the jetblue_data table with initial dataset
def insert_initial_jetblue_data(db):
    import resume_parser
    insert_into_db(db, resume_parser.parseResume())
