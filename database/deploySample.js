const { makeDb } =require('./makeDb');
const path = require('path');
const {readdir} = require('fs/promises');
const fs = require('fs');

const myArgs=process.argv.slice(2);
var dbName;
var filename=path.join(__dirname,'sampleData.sql');

if (myArgs.length>0) {
	dbName=myArgs[0];
}
else {
	throw Error("Must provide name of database to populate");
}

if (myArgs.length>1) {
	filename=myArgs[1];
}
console.log(dbName);

const config={
	host:"localhost",
	user:"admin",
	password:"",
	multipleStatements:true
};

const db=makeDb(config);

db.query(`USE ${dbName}`).then(() => {
	const query=fs.readFileSync(filename,'utf8');
	db.query(query).then(() => {
		db.close();
	})
});