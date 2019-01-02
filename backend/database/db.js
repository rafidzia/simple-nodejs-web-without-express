const mysql = require('mysql');
const settings = require('./settings');

exports.executeSql = (sql, callback)=>{
    let conn = mysql.createConnection(settings.dbconfig); 
        conn.connect((err)=>{
            if(err){console.log(err); callback(null,err)}
            else{
                    conn.query(sql, (err, result)=>{
                        if(err){console.log(err); callback(null,err)}
                        else{callback(result)}
                        conn.end();
                    });
            }
        }); 
}
