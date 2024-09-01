const garmin = require("garmin-connect");
const { GarminConnect } = garmin;
const { existsSync, mkdirSync } = require("fs");
const db =require('../database/appDb');

/**
 * Get a GarminConnect client.
 * Will use a token folder if is available,
 * or will use the username and password and create a token folder.
 *
 * @param {string} username - The Garmin username, is really an email address.
 * @param {string} password - The Garmin password.
 * @param {string} tokenFolder - The folder to read / write the token to.
 *
 * @returns {Promise<GarminConnect>} The Garmin client.
 */
const getClient = async (username, password, tokenFolder) => {
    // Create the client
    const client = new GarminConnect({});

    // If the token folder already exists
    if (existsSync(tokenFolder)) {
        // Load the token
        client.loadTokenByFile(tokenFolder);
    } else {
        // Or login
        await client.login(username, password);
    }

    // Check for expired / invalid token
    try {
        // Try and do a simple request
        await client.getSteps();
    } catch {
        // If failed, login again
        await client.login(username, password);
    }

    // Save the token
    client.exportTokenToFile(tokenFolder);

    return client;
};

const tokensDir = "garmin_tokens";
exports.update = () => {
    if (!existsSync(tokensDir)) {
        mkdirSync(tokensDir);
    }
    db.setup().then(async () => {
        const garminPlayers=await db.getObjectsFromQueryRows("CALL GetGarminPlayers()", ["name", "garmin_user", "garmin_pass"]);
        const date = new Date();
        for (const player of garminPlayers) {
            console.log(player.name);
            const client = await getClient(player.garmin_user, player.garmin_pass, `${tokensDir}/${player.name}`);
            const date = new Date();
            for(let day_interval=0; day_interval<14; day_interval++) {
                const steps = await client.getSteps(date);
                if (steps!=null) {
                    const dbDate = date.toISOString().substring(0,10);
                    console.log(dbDate, steps);
                    await db.runQuery(`CALL AddSteps('${player.name}','${dbDate}','${steps}')`);
                }
                date.setDate(date.getDate() - 1); // go back a day
            }
        }
        await db.close();
    });
}
