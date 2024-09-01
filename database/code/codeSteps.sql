CREATE PROCEDURE `AddSteps` (IN `parName` VARCHAR(30), IN `parDate` date, IN `parSteps` MEDIUMINT) BEGIN
REPLACE INTO
    Steps(player_id, date, steps)
SELECT
    id, parDate, parSteps
FROM
    Players
WHERE
    name = parName;
END;

CREATE PROCEDURE `GetPeriodSteps` (IN `parName` VARCHAR(30), IN `parStartDate` date, IN `parEndDate` date) BEGIN
    SELECT
        SUM(steps) AS steps
    FROM
        Steps
        INNER JOIN Players ON Steps.player_id = Players.id
    WHERE
        Players.name = parName
        AND date BETWEEN parStartDate AND parEndDate;
END;

