const path = require('path'),
      fs = require('fs'),
      mysql = require('mysql');

exports.dbconfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "nodedb"
};

exports.webPort = 8000;

exports.httpMsgsFormat = "HTML";

exports.striptag = function(string){
    // var a = string % 1;
    string = String(string)
    string = string.replace(/<|>/gi, " ");
    // if(a == 0){
    //     return parseInt(string.split(/[\'\`]+/gi).join(""));
    // }
    return string;
}
exports.escape = function(string){
    // var a = string % 1;
    string = String(string)
    string = mysql.escape(string);
    // if(a == 0){
    //     return parseInt(string.split(/[\'\`]+/gi).join(""));
    // }
    return string
}
exports.tesInput = function(data, unescape = false){
    data = exports.striptag(data);
    if(unescape == false){
        data = exports.escape(data);
    }
    return data;
}
exports.tesInputArr = function(arrData, unescape = false){
    for(a in arrData){
        arrData[a] = exports.tesInput(arrData[a], unescape);
    }
    return arrData;
}
