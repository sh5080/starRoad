-- 각 날짜에 해당하는 장소들
-- CREATE TABLE `TravelLocation` (
--     `userId` VARCHAR(20) NOT NULL,
--     `locationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--     `planId` INT UNSIGNED,
--     `date` DATE,
--     `location` VARCHAR(100),
--     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     PRIMARY KEY (`locationId`),
--     FOREIGN KEY (`planId`) REFERENCES `TravelPlan` (`planId`),
--     FOREIGN KEY (`userId`) REFERENCES `TravelPlan` (`userId`)
-- );
CREATE TABLE `TravelLocation` (
    `user_id` VARCHAR(20) NOT NULL,
    `location_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_id` INT UNSIGNED,
    `date` DATE,
    `location` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`location_id`),
    FOREIGN KEY (`plan_id`) REFERENCES `Travel_plan` (`plan_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Travel_plan` (`user_id`)
);