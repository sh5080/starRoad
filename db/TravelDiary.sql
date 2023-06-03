CREATE TABLE `TravelDiary` (
    `diaryId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `planId` INT UNSIGNED,
    `title` VARCHAR(100),
    `content` TEXT,
    `image` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`diaryId`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    FOREIGN KEY (`planId`) REFERENCES `TravelPlan` (`planId`)
);