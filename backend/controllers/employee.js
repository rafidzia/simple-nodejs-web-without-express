const db = require('../database/db');
const httpMsgs = require('../core/httpMsgs');
const util = require('util')

exports.getList = (req, res)=>{
    db.executeSql("SELECT * FROM employee", (data, err)=>{
        if(err){
            httpMsgs.show500(req, res, err);
        }else{
            httpMsgs.sendJson(req, res, data);
        }
    });
};

exports.get = (req, res, empid)=>{
    db.executeSql("select * from employee where empid=" + empid, (data, err)=>{
       if(err) {
           httpMsgs.show500(req, res, err);
       }else{
           httpMsgs.sendJson(req, res, data);
       }
    });
};

exports.add = (req, res, reqBody)=>{
    try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if(data){
            let sql = "insert into employee (name, department, position) values ";
            sql += util.format("('%s', '%s', '%s')", data.name,  data.depart, data.posit);
            db.executeSql(sql, (data, err)=>{
               if(err){
                   httpMsgs.show500(req, res, err);
               }else{
                   httpMsgs.send200(req, res);
               }
            });
        }else{
            
        }
    }catch(ex){
        httpMsgs.show500(req, res, ex);
    }
};

exports.update = (req, res, reqBody)=>{
    try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if(data){
            if(!data.empid) throw new Error("empid not provided");
            let sql = "update employee set ";
            let isDataProvided = false;
            if(data.name){
                sql += " name = '" +data.name +"',";
                isDataProvided = true;  
            }
            if(data.depart){
                sql += " department = '" +data.depart +"',";
                isDataProvided = true;  
            }
            if(data.posit){
                sql += " position = '" +data.posit +"',";
                isDataProvided = true;  
            }
            sql = sql.slice(0, -1); //remove last comma
            sql += "where empid = " + data.empid;
            db.executeSql(sql, (data, err)=>{
               if(err){
                   httpMsgs.show500(req, res, err);
               }else{
                   httpMsgs.send200(req, res);
               }
            });
        }else{
            
        }
    }catch(ex){
        httpMsgs.show500(req, res, ex);
    }
};

exports.delete = (req, res, reqBody)=>{
        try{
        if(!reqBody) throw new Error("Input not valid");
        var data = JSON.parse(reqBody);
        if(data){
            if(!data.empid) throw new Error("empid not provided");
            let sql = "delete from employee";
            sql += " where empid = "+ data.empid;
            db.executeSql(sql, (data, err)=>{
               if(err){
                   httpMsgs.show500(req, res, err);
               }else{
                   httpMsgs.send200(req, res);
               }
            });
        }else{
            
        }
    }catch(ex){
        httpMsgs.show500(req, res, ex);
    }
};
