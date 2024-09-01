const db =require('../database/appDb');

// Run this interactively, and pass name username and password parameters
//

const myArgs=process.argv.slice(1);

if (myArgs.length != 4) {
    console.log("Usage: node "+myArgs[0].split('/').pop()+" <name> <username> <password>");
    process.exit();
}

const name= myArgs[1];
const username= myArgs[2];
const password= myArgs[3];

db.setup().then(async () => {
    await db.runQuery(`CALL AddGarminPlayer('${name}','${username}','${password}')`);
    await db.close();
});
