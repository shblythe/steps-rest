const { makeDb } =require('./makeDb');

var dbName='steps';

/*
const myArgs=process.argv.slice(2);

if (myArgs.length>0) {
	dbName=myArgs[0];
}
*/

//console.log(dbName);

const config={
	host:"localhost",
	user:"admin",
	password:"",
	dateStrings:[
		'DATE',
		'DATETIME'
	]
};

const db=makeDb(config);

const getQueryResult = async (query) => {
	//console.log(query);
	results=await db.query(query);
	//console.log(results);
	return results[0];
}

const objectFromRowFields = (row,fields) => Object.fromEntries(
	new Map(fields.map((field)=>[field,row[field]]))
)

exports.close= async () => {
    await db.close();
}

// Pass a query, and a list of fields, and the values of those fields from
// each row will be returned in an array of JSON Objects, with the field names used for keys
exports.getObjectsFromQueryRows= async (query,fields) => {
        await db.query(`USE ${dbName}`);
	const rows=await getQueryResult(query);
	const out= rows.map((row)=>objectFromRowFields(row,fields));
	//console.log(out);
	return out;
}

// As above, but for a query which only ever returns one row
// Pass a query, and a list of fields, and the values of those fields from
// the one row result will be returned in a single JSON Object, with the field names as keys
exports.getSingleObjectFromQueryRow=async (query,fields) => {
        await db.query(`USE ${dbName}`);
	const rows=await getQueryResult(query);
	if (rows.length===0)
		return undefined;
	const out=objectFromRowFields(rows[0],fields);
	//console.log(out);
	return out;
}

// Pass a query, and a single field, and the values of that field will be returned
// in an array
exports.getSimpleArrayFromQueryRows = async (query,field) => {
        await db.query(`USE ${dbName}`);
	const rows=await getQueryResult(query);

	return rows.map((row)=>row[field]);
}

// Run a query with no output
exports.runQuery = async (query,checkAffectedRows=false) => {
        await db.query(`USE ${dbName}`);
	const rows=await db.query(query);
	if (checkAffectedRows && rows['affectedRows']==0) {
		throw new Error ('Not found');
	}
}
