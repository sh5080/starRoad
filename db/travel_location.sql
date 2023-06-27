<<<<<<< HEAD

CREATE TABLE `travel_location` (
    `username` VARCHAR(20) NOT NULL,
    `location_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` INT UNSIGNED,
    `date` DATE,
    `location` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `order` INT,
    PRIMARY KEY (`location_id`),
    FOREIGN KEY (`plan_id`) REFERENCES `travel_plan` (`plan_id`),
    FOREIGN KEY (`username`) REFERENCES `travel_plan` (`username`)
=======
CREATE TABLE `travel_location` (
    `location_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` INT UNSIGNED,
    `date` DATE,
    `location` VARCHAR(255),
    `order` INT,
    `latitude` DECIMAL(10, 8),
    `longitude` DECIMAL(11, 8),
    PRIMARY KEY (`location_id`)
>>>>>>> bf982492da79ab0d02562b9c370e731f68318111
);