CREATE TABLE `Comment` (
    `commentId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `diaryId` VARCHAR(20) UNSIGNED,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`commentId`),
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    FOREIGN KEY (`diaryId`) REFERENCES `TravelDiary` (`diaryId`)
);

