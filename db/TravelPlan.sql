-- CREATE TABLE `TravelPlan` (
--     `planId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--     `userId` VARCHAR(20) NOT NULL,
--     `startDate` DATE,
--     `endDate` DATE,
--     `destination` VARCHAR(100),
--     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     PRIMARY KEY (`planId`),
--     FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
-- );
CREATE TABLE `TravelPlan` (
    `plan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(20) NOT NULL,
    `start_date` DATE,
    `end_date` DATE,
    `destination` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`plan_id`),
    FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
);