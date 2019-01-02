const db = require('../database/db');
const httpMsgs = require('../core/httpMsgs');
const httpReq = require('../core/httpRequest');
const settings = require('../database/settings');
const util = require('util');
var fs = require('fs');
var path= require('path');
var crypto = require('crypto');
const mysql = require('mysql');



exports.getOrder = function(req, res, data){
    var idBrg = [];
    var jumlahBrg = [];
    for(var i = 0; i < data.length; i++){
        idBrg.push(parseInt(settings.tesInput(data[i][0], true)));
        jumlahBrg.push(parseInt(settings.tesInput(data[i][1], true)));
    }
    db.executeSql("select * from barang where id_brg in (" + idBrg.join(",") + ")", function(data, err){
        if(err){
            httpMsgs.show500(req, res, err);
        }else{
            for(var i = 0; i < data.length; i++){
                var position = idBrg.indexOf(data[i].id_brg);
                data[i].jumlah_beli = jumlahBrg[position];
            }
            httpMsgs.sendJson(req, res, data);
        }
    });
}

exports.postOrder = function(req, res, data){
    var date = new Date().getTime();
    // var objName = ['name', 'organization', 'phone', 'email', 'address', 'address', 'postcode', 'province', 'city','subdistrict', 'village','description','courier','packet','totbrg'];
    // for(var i = 0; i < data.length; i++){
    //     data[objName[i]] = settings.striptag(data[objName[i]]);
    // }
    data = settings.tesInputArr(data);
    db.executeSql("select nomor_hp from pemesanan", function(databarang){
      var dataNomor = [];
      if(databarang != null){
        for(var i = 0; i < databarang.length; i++){
          dataNomor.push(databarang[i].nomor_hp);
        }
      }
      if(dataNomor.indexOf(data.phone) >= 0){
        res.writeHead(200);
        res.write("false");
        res.end();
      }else{
        var kurir = data.courier + ";" + data.packet;
        db.executeSql("INSERT INTO pemesanan (nama_pemesan, nama_instansi, nomor_hp, email, alamat, nomor_pos, provinsi, kota, kecamatan, kelurahan, deskripsi, kurir, barang, tanggal) VALUES ("+ data.name+", "+ data.organization+", "+ data.phone+", "+ data.email+", "+ data.address+", "+ data.postcode +", "+ data.province +", "+ data.city +", "+ data.subdistrict +", "+ data.village +", "+ data.description +", "+ kurir +", "+ data.totbrg +","+ date +")", function(result){
                res.writeHead(200, {"Set-Cookie": ["noPesan="+ data.phone+";"]});
                res.write("true");
                res.end();
        });
      }
    })

}

exports.getBayar = function(req, res, data){
    db.executeSql("select * from pemesanan where nomor_hp = "+ settings.tesInput(data), function(data1){
        if(data1.length > 0){
         httpReq.getTotal(data1, function(data2){
            data2 = data2[0]
            httpReq.getOngkir(data2, req, res, function(data3){
                httpMsgs.sendJson(req, res, data2);
            })
            
         })
        }else{
            res.writeHead(200);
            res.write("false");
            res.end();
        }
    })
}

exports.postBayar = function(req, res, data, proceed){
    db.executeSql("select * from pemesanan where nomor_hp = "+ settings.tesInput(data.phone), function(result1){
        if(result1.length == 1){
        result1 = result1[0];
        httpReq.getOngkir(result1, req ,res, function(result){
            result = settings.tesInputArr(result);
            var foldername = result.nomor_hp + result.tanggal
            foldername = crypto.createHash('sha256').update(foldername).digest("hex");
            var filePath = "./frontend/assets/images/pesan/" + foldername;
            fs.access(filePath, function(error){
                if(error){
                    fs.mkdir(filePath, function(err){
                        if(err){console.log(err)}
                        else{
                            proceed(filePath + "/", function(newName){
                              var barang = result.barang.split(";");
                              var idBrg = [];
                              for(var i = 0;i < barang.length;i++){
                                idBrg[i] = barang[i].split(",")
                                idBrg[i] = idBrg[i][0];
                              }
                              idBrg = "(" + idBrg.join(")(") + ")";
                              db.executeSql(
                                "INSERT INTO konfirmasi_brg (nama_pemesan, nama_instansi, nomor_hp, email, alamat, nomor_pos, provinsi, kota, kecamatan, kelurahan, deskripsi, kurir, ongkir, barang, wild_brg, filename, tanggal) VALUES ("+ result.nama_pemesan +", "+ result.nama_instansi +", "+ result.nomor_hp +", "+ result.email +", "+ result.alamat +", "+ result.nomor_pos +", "+ result.provinsi +", "+ result.kota +", "+ result.kecamatan +", "+ result.kelurahan +", "+ result.deskripsi+", "+ result.kurir+", "+ result.ongkir+", "+ result.barang +", '" +idBrg+"','"+ path.basename(newName[0])+"', "+ result.tanggal +")", function(dataLanjutan){
                                db.executeSql("delete from pemesanan where id_pesan = "+ result.id_pesan, function(dataLanjutanLagi){
                                  res.write("<script>alert('Terima Kasih telah melakukan pembayaran, barang pesanan anda akan kami kirim secepatnya'); window.location='/'</script>");
                                  res.end();
                                });
                              })
                            });
                        }
                    })
                }else{
                  proceed("./frontend/assets/images/draft_pesan/", function(){
                    res.writeHead(200, {"Content-Type": "text/html"})
                    res.write("<script>alert('sebelumnya Anda telah mengupload bukti pembayaran'); window.location='/bayar'</script>");
                    res.end();
                  })
                }
            })
        
        })
    }else{
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write("<script>alert('Pemesanan tidak terdaftar'); window.location='/bayar'</script>");
        res.end();
     }
    })
}

exports.postBayarImg = function(req, res){

}
