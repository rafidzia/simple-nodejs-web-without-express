const db = require('../database/db');
const httpMsgs = require('../core/httpMsgs');
const httpReq = require('../core/httpRequest');
const settings = require('../database/settings');
const util = require('util')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');


exports.login = function(req, res, data){
    data = settings.tesInputArr(data, true);
    var username = crypto.createHash('sha256').update(String(data.username)).digest("hex");
    var password = crypto.createHash('sha256').update(String(data.password)).digest("hex");
    username = settings.escape(username);
    password = settings.escape(password);
    db.executeSql("select * from user where username = "+ username +" and password = "+ password +"", function(data){
        if(data.length == 1){
            if(data[0].level == 1){
              res.writeHead(200, {"Set-Cookie" : ['username='+data[0].username+'; path=/', 'password='+data[0].password+'; path=/', 'name='+data[0].name+'; path=/']});
              res.write("admin");
            }else if(data[0].level == 2){
              res.writeHead(200, {"Set-Cookie" : ['username='+data[0].username+'; path=/', 'password='+data[0].password+'; path=/', 'name='+data[0].name +'; path=/']});
              res.write("user");
            }
        }else{
            res.write("false");
        }
        res.end();
    });
}


function endReq(res, dat, num){
  var key = Object.keys(dat);
    if(key.length == num){
      res.writeHead(200);
      res.write(JSON.stringify(dat));
      res.end();
    }
}

exports.admin = function(req, res){
  var collectData = {};
  

  db.executeSql("select * from user where level = 2", function(data){
    if(data.length > 0){
      collectData['ttlSiswa'] = data.length;
    }else{
      collectData['ttlSiswa'] = 0;
    }
    endReq(res, collectData, 5);
  });
  db.executeSql("select * from pesanan_acc", function(data){
    if(data.length > 0){
      collectData['ttlJual'] = data.length;
    }else{
      collectData['ttlJual'] = 0;
    }
    endReq(res, collectData, 5);
  });
  db.executeSql("select * from barang where status != 'd' ", function(data){
    if(data.length > 0){
      collectData['ttlBrg'] = data.length;
    }else{
      collectData['ttlBrg'] = 0;
    }
    endReq(res, collectData, 5);
  });
  db.executeSql("select barang from pesanan_acc", function(data){
    if(data.length > 0){
      var brgSp = [];
      var idBrg = []
      var jmlBrg = [];
      for(var i = 0; i < data.length; i++){
        brgSp[i] = data[i].barang.split(";");
        for(var j = 0; j < brgSp[i].length; j++){
          idBrg.push(brgSp[i][j].split(",")[0]);
          jmlBrg.push(brgSp[i][j].split(",")[1]);
        }
      }
      db.executeSql("select id_brg, harga_brg from barang where id_brg in("+ idBrg.join(",") +")", function(data1){
        var ttlHarga = 0;
        var arrHarga = [];
        for(var i = 0;i < data1.length;i++){
          arrHarga.push(parseInt(data1[i].harga_brg) * parseInt(jmlBrg[idBrg.indexOf(String(data1[i].id_brg))]));
          ttlHarga += arrHarga[i];
        }
        collectData['ttlOmset'] = ttlHarga;
        endReq(res, collectData, 5);
      })
    }else{
        collectData['ttlOmset'] = 0;
        endReq(res, collectData, 5);
    }
  });

  db.executeSql("select id_pesan, nama_pemesan, barang, nomor_hp from konfirmasi_brg where status = 'n'", function(data){
    if(data.length > 0){
      httpReq.getTotal(data, function(data){
        collectData['listPesan'] = data;
        endReq(res, collectData, 5);
      });
    }else{
        collectData['listPesan'] = false;
        endReq(res, collectData, 5);
    }
  })
}

exports.adminPesanan = function(req, res){
  var collectData = {};
  db.executeSql("select * from konfirmasi_brg order by id_pesan desc", function(data){
    if(data.length > 0){
      db.executeSql("select id_pesan, status from pesanan_acc order by id_pesan desc", function(data1){
        httpReq.getTotal(data, function(data){
          if(data1.length > 0){
            var pesAcc = [];
            var pesAccStat = [];
            for(var i = 0; i < data1.length; i++){
              pesAcc.push(data1[i].id_pesan);
              pesAccStat.push(data1[i].status);
            }
          }
          for(var i = 0; i < data.length; i++){
            var foldername = data[i].nomor_hp + data[i].tanggal
            data[i].foldername = crypto.createHash('sha256').update(foldername).digest("hex");
            data[i].statAcc = "";
            if(data1.length > 0){
              var resTes = pesAcc.indexOf(data[i].id_pesan);
              if(resTes >= 0){
                data[i].statAcc = pesAccStat[String(resTes)];
              }
            }
          }
          collectData['listPesan'] = data;
          endReq(res, collectData, 1);
        })
      })
    }else{
      collectData['listPesan'] = false;
      endReq(res, collectData, 1);
    }
  })
}



exports.adminSiswa = function(req, res){
  var collectData = {};
  db.executeSql("select name,id_user,majors,class,shop from user where level = 2 order by id_user desc", function(data){
    if(data.length > 0){
      collectData['listSiswa'] = data;
      endReq(res, collectData, 1);
    }else{
      collectData['listSiswa'] = false;
      endReq(res, collectData, 1);
    }
  })
}

exports.acceptPesan = function(req, res, id){
  id = settings.tesInput(id);
  db.executeSql("update konfirmasi_brg set status = 'y' where id_pesan = "+ id +"", function(data){
    db.executeSql("select * from konfirmasi_brg where id_pesan = "+ id +"", function(data1){
      data1 = data1[0]
      db.executeSql("INSERT INTO pesanan_acc (id_pesan, nama_pemesan, nama_instansi, nomor_hp, email, alamat, nomor_pos, provinsi, kota, kecamatan, kelurahan, deskripsi, kurir, ongkir, barang, wild_brg, filename, tanggal) VALUES ("+ id +",'"+data1.nama_pemesan +"','"+ data1.nama_instansi+"','"+ data1.nomor_hp+"','"+ data1.email+"','"+ data1.alamat+"','"+ data1.nomor_pos+"','"+ data1.provinsi+"','"+ data1.kota+"','"+ data1.kecamatan+"','"+ data1.kelurahan+"','"+ data1.deskripsi+"','"+ data1.kurir+"','"+ data1.ongkir+"','"+ data1.barang+"','"+ data1.wild_brg+"','"+ data1.filename+"','"+ data1.tanggal +"')", function(data2){
        var brg = data1.barang;
        brg = brg.split(";");
        var idBrg = [];
        var jmlBrg = [];
        var stat = 0;
        for(var i = 0; i < brg.length; i++){
          idBrg[i] = brg[i].split(",")[0];
          jmlBrg[i] = brg[i].split(",")[1];
          db.executeSql("update barang set terjual_brg = terjual_brg + "+ parseInt(jmlBrg[i]) +", jumlah_brg = jumlah_brg - "+ parseInt(jmlBrg[i]) +" where id_brg = "+ idBrg[i], function(data3){
            stat+=1;
            if(stat == brg.length){
              res.end();
            }
          })
        }

      })

    })
  })
}

exports.declinePesan = function(req, res, id){
  db.executeSql("update konfirmasi_brg set status = 'y' where id_pesan = "+ settings.tesInput(id) +"", function(data){
    res.end();
  })
}

exports.accKirim = function(req, res, id){
  db.executeSql("update pesanan_acc set status = 's' where id_pesan = "+ settings.tesInput(id), function(data){
    res.end();
  })
}

exports.tambahSiswa = function(req, res, data){
  data = settings.tesInputArr(data, true);
  var username = crypto.createHash('sha256').update(data.username).digest("hex");
  var password = crypto.createHash('sha256').update(data.password).digest("hex");
  data = settings.tesInputArr(data);
  username = settings.escape(username);
  password = settings.escape(password);
  db.executeSql("insert into user (name, class, majors, shop, username, password, level) values ("+ data.name+","+ data.class +","+ data.majors +","+ data.shop +","+ username +","+ password +", 2)", function(data1){
    res.end();
  })
}

exports.editSiswa = function(req ,res, data){
  data = settings.tesInputArr(data, true);
  var username = crypto.createHash('sha256').update(data.username).digest("hex");
  var password = crypto.createHash('sha256').update(data.password).digest("hex");
  data = settings.tesInputArr(data);
  username = settings.escape(username);
  password = settings.escape(password);
  db.executeSql("update user set name = "+data.name+", class = "+data.class+", majors = "+data.majors+", shop = "+data.shop+", username = "+username+", password = "+password+", level = 2 where id_user = "+data.id_user+"", function(data1){
    res.end();
  })
}

exports.deleteSiswa = function(req, res, id){
  db.executeSql("delete from user where id_user = "+ settings.tesInput(id), function(data){
    res.end();
  })
}

// from now on, this is 'siswa' controllers
exports.user = function(req, res, id){
  var collectData = {};
    db.executeSql("select * from barang where id_user = '"+ id +"'", function(data1){
      if(data1.length > 0){
        collectData['ttlBrg'] = data1.length;
        var data1Id = [];
        for(var i = 0; i < data1.length; i++){
          data1Id.push(data1[i].id_brg);
          data1Id[i] = "[(]" + data1Id[i] + "[)]";
        }
        data1Id = data1Id.join("|");
      }else{
        data1.length = 0;
        collectData['ttlBrg'] = data1.length;
        data1Id = "[(]0[)]"
      }
      
      db.executeSql("select * from pesanan_acc where wild_brg REGEXP '"+ data1Id + "'", function(data2){
        if(data2.length > 0){
          collectData['ttlJual'] = data2.length;
          var brgSp = [];
          var idBrg = []
          var jmlBrg = [];
          for(var i = 0; i < data2.length; i++){
            brgSp[i] = data2[i].barang.split(";");
            for(var j = 0; j < brgSp[i].length; j++){
              idBrg.push(brgSp[i][j].split(",")[0]);
              jmlBrg.push(brgSp[i][j].split(",")[1]);
            }
          }
          var brgJualId = [];
          for(var i = 0; i < data1.length; i++){
            var brgTest = idBrg.indexOf(String(data1[i].id_brg))
            if(brgTest >= 0){
              brgJualId.push(data1[i].id_brg);
            }
          }
          
          db.executeSql("select id_brg, nama_brg, harga_brg, gambar_brg, jumlah_brg, terjual_brg from barang where id_brg in("+ brgJualId.join(",") +")", function(data3){
            var ttlHarga = 0;
            var arrHarga = [];
            for(var i = 0;i < data3.length;i++){
              arrHarga.push(parseInt(data3[i].harga_brg) * parseInt(data3[i].terjual_brg));
              ttlHarga += arrHarga[i];
            }
            
            collectData['listJual'] = data3;
            collectData['ttlOmset'] = ttlHarga;
            endReq(res, collectData, 5);
          })
        }else{
          collectData['listJual'] = false;
          collectData['ttlJual'] = 0;
          collectData['ttlOmset'] = 0;
          endReq(res, collectData, 5);
        }
      })
      db.executeSql("select * from pesanan_acc where status = 'b' and wild_brg REGEXP '"+ data1Id + "'", function(data2){
        if(data2.length > 0){
          httpReq.getTotal(data2, function(data3){
            collectData['listPesan'] = data3;
            endReq(res, collectData, 5);
          })
        }else{
          collectData['listPesan'] = false;
          endReq(res, collectData, 5);
        }
      })
    });

}

exports.pesananUser = function(req, res, id){
  var collectData = {};
  db.executeSql("select id_brg from barang where id_user = "+ settings.tesInput(id)+"", function(data){
    if(data.length > 0){
      var dataId = [];
      var idCollect = [];
      for(var i = 0; i < data.length; i++){
        dataId.push(data[i].id_brg);
        dataId[i] = "[(]" + dataId[i] + "[)]";
        idCollect.push(data[i].id_brg);
      }
      dataId = dataId.join("|");
    }else{
      data.length = 0;
      dataId = "[(]0[)]";
    }
    db.executeSql("select * from pesanan_acc where wild_brg REGEXP '"+ dataId + "'", function(data1){
      if(data1.length > 0){
        httpReq.getTotal(data1, function(data2){
          for(var i = 0; i < data2.length; i++){
            var foldername = data2[i].nomor_hp + data2[i].tanggal
            data2[i].foldername = crypto.createHash('sha256').update(foldername).digest("hex");
          }
          collectData['listPesan'] = data2;
          collectData['idPesanan'] = idCollect;
          endReq(res, collectData, 2);
        })
      }else{
        collectData['listPesan'] = false;
        collectData['idPesanan'] = false;
        endReq(res, collectData, 2);
      }
    })
  })
}


exports.lihatBrg = function(req, res, id){
  var collectData = {};
  db.executeSql("select * from barang where status != 'd' and id_user = "+ settings.tesInput(id) +" order by id_brg desc", function(data){
    if(data.length > 0){
      collectData['listBarang'] = data;
      endReq(res, collectData, 1);
    }else{
      collectData['listBarang'] = false;
      endReq(res, collectData, 1);
    }
  })
}

exports.tambahBrg = function(req, res, id, shop, data, proceed){
  var foldername = crypto.createHash('sha256').update(String(id)).digest("hex");
  var filePath = "./frontend/assets/images/barang/" + foldername;
  function insert(){
    proceed(filePath + "/", function(newName){
      data = settings.tesInputArr(data);
      id = settings.escape(id);
      shop = settings.escape(shop);
      db.executeSql("insert into barang (nama_brg, id_user, toko_brg, jenis_brg, jumlah_brg, berat_brg, harga_brg, deskripsi_brg, gambar_brg) values ("+data.nama+","+id+", "+shop+", "+data.jenis.toLowerCase()+", "+data.jumlah+", "+data.berat+","+data.harga+", "+data.deskripsi+", "+ foldername +"/"+ path.basename(newName[0])+")", function(data){
        res.end();
      })
    })
  }
  fs.access(filePath, function(error){
    if(error){
      fs.mkdir(filePath, function(err){
        if(err){console.log(err)}
        else{
          insert();
        }
      })
    }else{
      insert();
    }
  })
  
}

exports.editBrg = function(req, res, data){
  data = settings.tesInputArr(data);
  db.executeSql("update barang set nama_brg = "+data.nama+", jenis_brg = "+data.jenis.toLowerCase()+", jumlah_brg = "+data.jumlah+", berat_brg = "+data.berat+", harga_brg = "+data.harga+", deskripsi_brg = "+data.deskripsi+" where id_brg ="+data.id_brg, function(data){
    res.end();
  })
}

exports.deleteBrg = function(req, res, idBrg, idUser){
  db.executeSql("update barang set status = 'd' where id_brg = "+ settings.tesInput(idBrg)+" and id_user = "+ settings.tesInput(idUser) +";", function(data){
    res.end();
  })
}