CREATE TABLE travel_destination (
  id INT AUTO_INCREMENT,
  name_en VARCHAR(255),
  name_ko VARCHAR(255),
  image TEXT,
  introduction TEXT,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  PRIMARY KEY (id)
);