CREATE TABLE `travel_location` (
    `location_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` INT UNSIGNED,
    `date` DATE,
    `location` VARCHAR(255),
    `order` INT,
    `latitude` DECIMAL(10,8),
    `longitude` DECIMAL(11,8),
    PRIMARY KEY (`location_id`)
);