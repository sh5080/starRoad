
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
);