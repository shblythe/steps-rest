const path=require("path");
const { exec } = require("child_process");

var dbName='steps';
var autoDrop=false;	// Don't automatically drop the real DB!

const myArgs=process.argv.slice(2);

if (myArgs.length>0) {
	dbName=myArgs[0];
	autoDrop=true;
}

console.log(dbName);

exec(`mysqldump -t -u admin ${dbName} >${path.join(__dirname,"sampleData.sql")}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}
	console.log(`${stdout}`);
});
