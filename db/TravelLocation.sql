-- 각 날짜에 해당하는 장소들
CREATE TABLE `TravelLocation` (
    `userId` VARCHAR(20) NOT NULL,
    `locationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `planId` INT UNSIGNED,
    `date` DATE,
    `location` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`locationId`),
    FOREIGN KEY (`planId`) REFERENCES `TravelPlan` (`planId`),
    FOREIGN KEY (`userId`) REFERENCES `TravelPlan` (`userId`)
);
