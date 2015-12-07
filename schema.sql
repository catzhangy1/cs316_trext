DROP TABLE if EXISTS Trips;
DROP table if EXISTS TripDirectory;
DROP TABLE if EXISTS Attractions;
DROP TABLE if EXISTS Users;


CREATE TABLE Users
(username VARCHAR(256) NOT NULL,
 name VARCHAR(256) NOT NULL,
 password VARCHAR(256) NOT NULL,
 email VARCHAR(256) NOT NULL,
 UNIQUE(username));

CREATE TABLE Attractions
 (id VARCHAR(256) NOT NULL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  category VARCHAR(256),
  phone VARCHAR(256),
  address VARCHAR(256) NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  imageurl VARCHAR(256),
  UNIQUE(id,latitude,longitude));

CREATE TABLE TripDirectory
(tripname VARCHAR(256) NOT NULL,
stamp VARCHAR(256) NOT NULL,
PRIMARY KEY(stamp) 
);

CREATE TABLE Trips
(attractionID VARCHAR(256) NOT NULL references Attractions(id),
 tstamp VARCHAR(256) NOT NULL references TripDirectory(stamp),
 userID VARCHAR(256) NOT NULL references Users(username),
 UNIQUE(attractionID, tstamp, userID));

INSERT INTO Users(username,name,password,email) VALUES
	('tn52','Tze Kang','passcode','tn52@duke.edu'),
	('aj148','Arihant','reading','aj148@duke.edu'),
	 ('wkc10','William','hello','wkc10@duke.edu'),
    ('yzz2','Cat','lessismore','yzz2@duke.edu');

INSERT INTO Attractions(id,name,address,latitude,longitude) VALUES
	('statue-of-liberty-new-york-3','Statue of Liberty','Liberty IslandNew York,NY',40.6892,-74.0444),
	('starbucks-new-york-214','Starbucks','130 Fulton StNew York',40.710311,-74.008087),
	('whiskey-tavern-new-york','Whiskey Tavern','79 Baxer St, New York,NY',40.716465,-73.999687);

INSERT INTO TripDirectory(tripname,stamp) VALUES
	('advenure-in-nyc','Sun Dec 06 2015 00:36:09 GMT-0500 (EST)'),
	('live-life-in-the-city','Fri Dec 04 2015 12:36:09 GMT-0500 (EST)');

INSERT INTO Trips(attractionID, tstamp, userID) VALUES
	('statue-of-liberty-new-york-3','Sun Dec 06 2015 00:36:09 GMT-0500 (EST)','tn52'),
	('starbucks-new-york-214','Fri Dec 04 2015 12:36:09 GMT-0500 (EST)','aj148'),
	('statue-of-liberty-new-york-3','Fri Dec 04 2015 12:36:09 GMT-0500 (EST)','aj148'),
	('whiskey-tavern-new-york','Sun Dec 06 2015 00:36:09 GMT-0500 (EST)','tn52')
	;




