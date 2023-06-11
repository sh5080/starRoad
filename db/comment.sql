CREATE TABLE `comment` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `diary_id` INT UNSIGNED,
    `comment` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`username`) REFERENCES `user` (`username`),
    FOREIGN KEY (`diary_id`) REFERENCES `travel_diary` (`diary_id`)
);

