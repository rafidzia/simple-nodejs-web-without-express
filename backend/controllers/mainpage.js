const db = require('../database/db');
const httpMsgs = require('../core/httpMsgs');
const settings = require('../database/settings');
const util = require('util')
const mysql = require('mysql');

exports.getAll = function(req, res){
    db.executeSql("SELECT * FROM barang where status != 'd' and jumlah_brg > 0 order by id_brg desc", (data, err)=>{
        if(err){
            httpMsgs.show500(req, res, err);
        }else{
            httpMsgs.sendJson(req, res, data);
        }
    });
}

exports.getCat = function(req, res, cat){
    db.executeSql("select * from barang where status != 'd' and jenis_brg = " + settings.tesInput(cat) +" and jumlah_brg > 0 order by id_brg desc", (data, err)=>{
       if(err) {
           httpMsgs.show500(req, res, err);
       }else{
           httpMsgs.sendJson(req, res, data);
       }
    });
}

exports.getDetail = function(req, res, id){
    db.executeSql("select * from barang where status != 'd' and id_brg=" + settings.tesInput(id) + " and jumlah_brg > 0", (data, err)=>{
       if(err) {
           httpMsgs.show500(req, res, err);
       }else{
           httpMsgs.sendJson(req, res, data);
       }
    });
}

exports.getSearch = function(req, res, search){
    db.executeSql("select * from barang where status != 'd' and nama_brg like '%"+settings.tesInput(search, true)+"%'", function(data, err){
      if(err){
        httpMsgs.show500(req, res, err);
      }else{
        httpMsgs.sendJson(req, res, data);
      }
    });
}
