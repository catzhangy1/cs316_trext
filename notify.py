'''
Created on Nov 7, 2015

@author: catzhangy3
'''

import smtplib
from email.mime.text import MIMEText

API_USER = "trext.travel@gmail.com"
API_KEY = "compsci316"

# Starts an SMTP server for email sending
def start_server():
    server = smtplib.SMTP("smtp.gmail.com:587")
    server.ehlo()
    server.starttls()
    server.login(API_USER, API_KEY)
    return server

# Quits the SMTP server after emails are sent
def quit_server(server):
    server.quit()

# db = db connection;
def sharetrip(name, email, start, end):
    if name and email:
        server = start_server()
        msg = MIMEText(''.join([
            "Hi there, %s ! \n\n" % name,
            "Your friend wanted you to know that ",
            "he is going on an awesome trip from ",
            " %s to %s. \n\n All planned from Trext! " % (start, end),
            "Come check us out!",
            "\n\nSincerely, \n",
            "The Trext Team",
        ]))
        msg['Subject'] = "[Notification] Tired of Yelp?"
        msg['From'] = API_USER
        msg['To'] = name
        server.sendmail(API_KEY, email, msg.as_string())
        quit_server(server)