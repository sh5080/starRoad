CREATE TABLE `Comment` (
    `commentId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INT UNSIGNED,
    `diaryId` INT UNSIGNED,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`commentId`),
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
    FOREIGN KEY (`diaryId`) REFERENCES `TravelDiary` (`diaryId`)
);

-- 나중 db마이그레이션툴에 버져닝해서 관리
-- 성능이슈? REFERENCES
-- 캐스캐이딩?
-- 테이블이름 단수로
-- 커멘트는 특정 다이어리에 소속되어있다. 1:many관계
-- 하나의 다이어리에 여러개의 댓글
-- 기준테이블 (다이어리) 그대로 두고 달라붙는 테이블(코멘트)
-- 한 유저가 여러개의 댓글을 달 수 있기 때문에 userId 콜론이 들어가있다.

-- 특정유저가 작성한 comment 의 원래글을보고싶다.
-- JOIN VS LEFT JOIN(없는부분은 NULL 로채움)() -> 뭐가필요한지

SELECT *
FROM Comments AS C
LEFT JOIN TravelDiary AS TD ON TD.id = C.diaryId
WHERE userId = 2;

--postgreSQL
--molter.js 쓰고 sharp.js 쓰자.
--ls-la
--inode exhaustion

