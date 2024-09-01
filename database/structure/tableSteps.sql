CREATE TABLE `Steps` (
    `player_id` tinyint(3),
    `date` date NOT NULL,
    `steps` mediumint,
    UNIQUE KEY `unqRecord` (`player_id`,`date`)
);
