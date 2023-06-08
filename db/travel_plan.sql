CREATE TABLE `travel_plan` (
    `plan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `start_date` DATE,
    `end_date` DATE,
    `destination` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`plan_id`),
    FOREIGN KEY (`username`) REFERENCES `user` (`username`)
);