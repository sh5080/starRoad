CREATE TABLE travel_destination (
  id INT AUTO_INCREMENT,
  name_en VARCHAR(255),
  name_ko VARCHAR(255),
<<<<<<< HEAD
  image VARCHAR(255),
  introduction TEXT,
	PRIMARY KEY (id)
);
=======
  image TEXT,
  introduction TEXT,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  PRIMARY KEY (id)
);
>>>>>>> bf982492da79ab0d02562b9c370e731f68318111
