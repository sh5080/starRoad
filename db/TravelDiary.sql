CREATE TABLE `travel_diary` (
    `diary_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `plan_id` INT UNSIGNED,
    `title` VARCHAR(100),
    `content` TEXT,
    `image` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`diary_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
    FOREIGN KEY (`plan_id`) REFERENCES `travel_plan` (`plan_id`)
);