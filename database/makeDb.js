// Promisify mysql
// From https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628

// Notes promisify: https://codeburst.io/quick-dig-promisify-in-node-js-6d5d763f847d

const util = require( 'util' );
const mysql = require( 'mysql' );

exports.makeDb=( config ) => {
  const connection = mysql.createConnection( config );
  //console.log(connection);
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}
