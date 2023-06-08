CREATE TABLE `travel_diary` (
    `diary_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `plan_id` INT UNSIGNED,
    `title` VARCHAR(100),
    `content` TEXT,
    `image` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`diary_id`),
    FOREIGN KEY (`username`) REFERENCES `users` (`username`),
    FOREIGN KEY (`plan_id`) REFERENCES `travel_plan` (`plan_id`)
);