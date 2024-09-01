CREATE PROCEDURE `AddPostPlayer` (IN `parName` VARCHAR(30)) BEGIN
REPLACE INTO
	Players(name, active, method)
VALUES
	(parName, TRUE, 'post');

END;

CREATE PROCEDURE `AddGarminPlayer` (IN `parName` VARCHAR(30), IN `parGarminUser` VARCHAR(30), IN `parGarminPass` VARCHAR(30)) BEGIN
REPLACE INTO
        Players(name, active, method, garmin_user, garmin_pass)
VALUES
        (parName, TRUE, 'garmin', parGarminUser, parGarminPass);
END;

CREATE PROCEDURE `GetPlayers` () BEGIN #PARAMS()SMARAP#
SELECT * FROM Players;
END;

CREATE PROCEDURE `GetGarminPlayers` () BEGIN #PARAMS()SMARAP#
SELECT * FROM Players WHERE method='garmin';
END;

