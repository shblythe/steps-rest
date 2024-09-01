const { makeDb } =require('./makeDb');
const path = require('path');
const {readdir} = require('fs/promises');
const fs = require('fs');

var dbName='steps';
var autoDrop=false;	// Don't automatically drop the real DB!

const myArgs=process.argv.slice(2);

if (myArgs.length>0) {
	dbName=myArgs[0];
	autoDrop=true;
}

console.log(dbName);

const config={
	host:"localhost",
	user:"admin",
	password:"",
	multipleStatements:true
};

const db=makeDb(config);

const processFolder= async (folderName) => {
	const folderPath=path.join(__dirname,folderName);
	const files=await readdir(folderPath);
	files.forEach(async (file) => {
		console.log(file);
		const query=fs.readFileSync(path.join(folderPath,file),'utf8');
		try {
			await db.query(query);
		} catch(err) {
			if (err.code=='ER_PARSE_ERROR')
			{
				console.log(`SQL error parsing file ${file}:\n${err.sqlMessage}\n`);
			}
		}
	});
}
const create= async () => {
	try {
		if (autoDrop) {
			await db.query(`DROP DATABASE IF EXISTS ${dbName}`);
		}
		await db.query(`CREATE DATABASE ${dbName}`);
		console.log("Database created");
		await db.query(`USE ${dbName}`);
		await processFolder('structure');
		await processFolder('code');
	} catch (err) {
		if (err.code=='ER_DB_CREATE_EXISTS')
		{
			console.log("Database exists");
		}
		else
			throw err;
	} finally {
		db.close();
	}
}

create();
