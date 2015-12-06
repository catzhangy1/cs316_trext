DROP TABLE if EXISTS Users;
DROP TABLE if EXISTS Trips;
DROP TABLE if EXISTS History;
DROP TABLE if EXISTS Attractions;
DROP TABLE if EXISTS AttractionsInTrips;

CREATE TABLE Users
(id INTEGER NOT NULL,
 name VARCHAR(256) NOT NULL,
 password VARCHAR(256) NOT NULL,
 UNIQUE(id, password));

CREATE TABLE History
(userID INTEGER NOT NULL references Users(id),
 tripID INTEGER NOT NULL references Trips(id),
 tripName VARCHAR(256) NOT NULL,
 dot INTEGER NOT NULL,
 UNIQUE(userID,tripID,dot));

CREATE TABLE Attractions
 (id INTEGER NOT NULL,
  name VARCHAR(256) NOT NULL,
  details VARCHAR(256) NOT NULL);

CREATE TABLE Trips
(attractionID INTEGER NOT NULL references Attractions(id),
 tripID INTEGER NOT NULL,
 UNIQUE(attractionID, tripID));

INSERT INTO Users(id,name,password) VALUES
	(1,'Tze Kang','0'),
	(2,'Cat','password'),
	(3,'Will','abc'),
	(4,'Ari','123');

-- INSERT INTO Trips(id, name) VALUES
-- 	(1,'BESTTRIPEVER'),
-- 	(2,'WORSTRIPEVER'),
-- 	(3,'OKAYTRIPEVER');

INSERT INTO History(userID,tripID,dot) VALUES
	(1,1,0),
	(1,2,4),
	(2,3,1),
	(3,1,2),
	(4,1,2);

INSERT INTO Attractions(id,name,details) VALUES
	(1,'Duke','Cool place with Chapel'),
	(2,'UNC','Uncool place with nothing'),
	(3,'WaDUKE','spend ALL your money'),
	(4,'JimmyJohns','Free Smells');

INSERT INTO AttractionsInTrips(attractionID,tripID) VALUES
	(1,1),
	(1,2),
	(2,1),
	(2,2),
	(2,3),
	(3,1),
	(3,2),
	(3,3),
	(3,4);


