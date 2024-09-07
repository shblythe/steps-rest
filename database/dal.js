const db =require('../database/appDb');

exports.getPeriodSteps = async (player, startDate, endDate) => {
    const last = await db.getSingleObjectFromQueryRow(
        `CALL GetPeriodSteps('${player}','${startDate}','${endDate}')`,
        ["steps"]
    );
    return last.steps*1;
};

exports.addSteps = async (player, date, steps) => {
    db.runQuery(`CALL AddSteps('${player}','${date}',${steps})`)
}

exports.getPlayerNames = async () => {
    return db.getObjectsFromQueryRows(`CALL GetPlayers()`,["name"]);
}

exports.getThisWeekDates = () => {
    // Find most recent Monday
    let date = new Date();
    while (date.getDay() != 1)
        date.setDate(date.getDate() - 1);
    const week0start = date.toISOString().substr(0,10);
    date.setDate(date.getDate() + 6);
    const week0end = date.toISOString().substr(0,10);
    return {'start': week0start, 'end': week0end};
}

exports.getLastWeekDates = () => {
    // Find most recent Monday
    let date = new Date();
    while (date.getDay() != 1)
        date.setDate(date.getDate() - 1);
    date.setDate(date.getDate() - 7);
    const week1start = date.toISOString().substr(0,10);
    date.setDate(date.getDate() + 6);
    const week1end = date.toISOString().substr(0,10);
    return {'start': week1start, 'end': week1end};
}

exports.getPlayersWeek = async (players, start, end) => {
    let playersWeek=[];
    for (player of players) {
        const steps = await exports.getPeriodSteps(player.name, start, end);
        playersWeek.push({
            name: player.name,
            steps
        });
    }
    playersWeek.sort((a,b) => b.steps - a.steps);
    return playersWeek;
};

exports.getThisWeekStandings = async () => {
    const players = await exports.getPlayerNames();
    const week = exports.getThisWeekDates();
    const weekPlayers = await exports.getPlayersWeek(players, week.start, week.end);
    return {
        'start': week.start,
        'end': week.end,
        'players': weekPlayers
    };
}

exports.getLastWeekStandings = async () => {
    const players = await exports.getPlayerNames();
    const week = exports.getLastWeekDates();
    const weekPlayers = await exports.getPlayersWeek(players, week.start, week.end);
    return {
        'start': week.start,
        'end': week.end,
        'players': weekPlayers
    };
}

exports.getGarminPlayers = async () => {
    return await db.getObjectsFromQueryRows("CALL GetGarminPlayers()", ["name", "garmin_user", "garmin_pass"]);
}
