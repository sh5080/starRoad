-- CREATE TABLE `Comment` (
--     `commentId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--     `userId` VARCHAR(20) NOT NULL,
--     `diaryId` INT UNSIGNED,
--     `comment` TEXT,
--     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     PRIMARY KEY (`commentId`),
--     FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
--     FOREIGN KEY (`diaryId`) REFERENCES `TravelDiary` (`diaryId`)
-- );
CREATE TABLE `Comment` (
    `comment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `diary_id` INT UNSIGNED,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`comment_id`),
    FOREIGN KEY (`user_id`) REFERENCES `User` (`id`),
    FOREIGN KEY (`diary_id`) REFERENCES `Travel_diary` (`diary_id`)
);


