CREATE TABLE `Players` (
    `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(30) NOT NULL,
    `active` tinyint(1) NOT NULL,
    `method` ENUM('garmin', 'post'),
    `garmin_user` varchar(30),
    `garmin_pass` varchar(30),

    PRIMARY KEY (`id`),
    UNIQUE KEY `unqName` (`name`)
);
