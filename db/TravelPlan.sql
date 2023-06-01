CREATE TABLE `TravelPlan` (
    `planId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INT UNSIGNED,
    `startDate` DATE,
    `endDate` DATE,
    `destination` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`planId`),
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
);