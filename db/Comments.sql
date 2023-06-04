CREATE TABLE `comment` (
    `comment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `diary_id` INT UNSIGNED,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`commentId`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`diary_id`) REFERENCES `travel_diary` (`diary_id`)
);

