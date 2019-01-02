var https = require("https");
var formidable = require('formidable');
var fs = require('fs');
var qs = require('querystring')
var httpStc = require('./httpStatic');
var httpMsgs = require('./httpMsgs');
var db = require('../database/db');
var nodemailer = require('nodemailer')


exports.htmlAndJson = function(req, html, json){
    if(req.headers.accept != 'json'){
        if(html){
            html();
        }
    }else{
        if(json){
            json();
        }
    }
}

exports.showHome = (req, res)=>{
    httpStc.getStatic("./frontend/index.html", res);
}

exports.reqOngkir = function(link, req, res, reqW, success){
    var options = {
        "method": "GET",
        "hostname": "api.rajaongkir.com",
        "port": null,
        "path": "/starter" + link,
        "headers": {
          "key": "6435fb18b055675697af4a30f5672d77"
        }
      };
      if(reqW){
        var string = qs.stringify(
            {
                origin: reqW[0],
                destination: reqW[1],
                weight: reqW[2],
                courier: reqW[3]
            })
          options.method = "POST";
          options.headers['content-type'] = "application/x-www-form-urlencoded";
          options.headers['content-length'] = Buffer.byteLength(string);
      }
      
      var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          body = body.toString();
          success(body);
        });
      });

        req.on('error', function(err){
            console.log(err);
            res.end();
        })
      if(reqW){
          req.write(string);
      }

      req.end();
}

exports.reqBody = function(req, success){
    var body = '' ;
    req.on('data', (data)=>{
        body+=data;
        if(body.length > 1e7){
            httpMsgs.show413(req, res);
        }
    });
    req.on('end', ()=>{
        success(body);
    });
}

exports.getCookie = function(req, cname){
    var name = cname + "=";
    var ca = req.headers.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

exports.tolak = function(res){
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("<script>window.location = '/login'; alert('You are not loged in')</script>");
    res.end();
}

exports.validateAdmin= function(req, res, success){
    if(req.headers.hasOwnProperty("cookie")){
        if((this.getCookie(req, "username") !== "") && (this.getCookie(req, "password") !== "")){
            var username = this.getCookie(req, "username")
                ,password = this.getCookie(req, "password");
            db.executeSql("select * from user where username = '"+ username +"' and password='"+ password +"'", function(data){
                if(data.length == 1){
                    if(data[0].level == 1){
                      exports.htmlAndJson(req, function(){
                        httpStc.getStatic("./frontend/admin.html", res);
                      }, function(){success()});
                    }else{
                      exports.tolak(res);
                    }

                }else{
                    this.tolak(res);
                }
            });
        }else{
            this.tolak(res);
        }
    }else{
        this.tolak(res);
    }
}
exports.validateUser = function(req, res, success){
    if(req.headers.hasOwnProperty("cookie")){
        if((this.getCookie(req, "username") !== "") && (this.getCookie(req, "password") !== "")){
            var username = this.getCookie(req, "username")
                ,password = this.getCookie(req, "password");
            db.executeSql("select * from user where username = '"+ username +"' and password='"+ password +"'", function(data){
                if(data.length == 1){
                  exports.htmlAndJson(req, function(){
                    if(data[0].level == 2){
                      httpStc.getStatic("./frontend/user.html", res);
                    }else{
                      exports.tolak(res);
                    }
                  }, function(){success(data[0].id_user, data[0].shop)});
                }else{
                    this.tolak(res);
                }
            });
        }else{
            this.tolak(res);
        }
    }else{
        this.tolak(res);
    }
}


exports.reqForm = function(req, res, baseDir, fileN, proceed){
    var form = new formidable.IncomingForm();
    form.uploadDir = baseDir;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err)
        }else{
            proceed(fields, function(newDir, upName){
              var oldpath = [];
              var newpath = [];
              for(let i = 0; i < fileN.length; i++){
                  oldpath[i] = files[fileN[i]].path;
                  newpath[i] = newDir + files[fileN[i]].name;
                  fs.rename(oldpath[i], newpath[i], function(err){
                      if(err){
                          console.log(err)
                      }else{
                          if(i == fileN.length - 1){
                            upName(newpath);
                          }
                      }
                  })
              }
            })
        }
    });
}

exports.getOngkir = function(data, req, res, callbackOut){
    exports.reqOngkir("/province", req, res, undefined, function(province){
        province = JSON.parse(province);
        province = province.rajaongkir.results;
        var allProvince = [];
        for(var i = 0; i < province.length; i++){
            allProvince.push(province[i].province);
        }
        var idProvince = province[allProvince.indexOf(data.provinsi)].province_id;
        exports.reqOngkir("/city?province=" + idProvince, req, res, undefined, function(city){
            city = JSON.parse(city);
            city = city.rajaongkir.results;
            var allCity = [];
            for(var i = 0; i < city.length; i++){
                allCity.push(city[i].city_name);
            }
            var idCity = city[allCity.indexOf(data.kota)].city_id;
            var pKurir = data.kurir.split(";").shift().trim();

            exports.getBerat(data.barang, function(berat){
                exports.reqOngkir("/cost", req, res, [48, idCity, berat, pKurir.toLowerCase()], function(cost){
                    cost = JSON.parse(cost);
                    cost = cost.rajaongkir.results[0];
                    var allCosts = [];
                    for(var i = 0; i < cost.costs.length; i++){
                        allCosts.push(cost.costs[i].service)
                    }
                    var costPosit = cost.costs[allCosts.indexOf(data.kurir.split(";").pop().trim())];
                    data.ongkir = costPosit.cost[0].value + ";" + costPosit.cost[0].etd;
                    callbackOut(data);
                })
            })
        })

    })
}

exports.getBerat = function(barangIn, beratOut){
    var idBrg = []
    var jmlBrg = [];
    var stat = 0;
    var ttlBerat = 0;
    var barang = barangIn.split(";");
    for(let i = 0; i < barang.length; i++){
        barang[i] = barang[i].split(",")
        idBrg.push(barang[i][0]);
        jmlBrg.push(barang[i][1]);
        db.executeSql("select berat_brg from barang where id_brg = " + idBrg[i], function(data){
            stat += 1;
            data = parseInt(data[0].berat_brg) * parseInt(jmlBrg[i]);
            ttlBerat += data;
            if(stat == barang.length){
                beratOut(ttlBerat);
            }
        })
    }
}


exports.getTotal = function(dataIn, dataOut){
    function hoboken(masuk, id, jml){
      db.executeSql("select * from barang where id_brg='"+ id +"'", function(data1){
        if(data1.length > 0){
            data1 = data1[0];
            stat += 1
            var newHrg = parseInt(data1.harga_brg) * parseInt(jml);
            masuk.ttl_harga += newHrg;
            if(masuk.kurir && masuk.ongkir){
            var ongkir = masuk.ongkir.split(";").shift();
            masuk.ttl_harga += parseInt(ongkir);
            }
            masuk.pcs +=  id + ","+ jml +"," + data1.harga_brg + "," + data1.nama_brg + ","+ data1.gambar_brg +";";
        }
        if(reqment == stat){
            dataOut(dataIn);
        }
      })
  }
  var barang = [];
  var reqment = 0
  var stat = 0;
  for(let i = 0; i < dataIn.length; i++){
      reqment += parseInt(dataIn[i].barang.split(";").length);
  }
  for(let i = 0; i < dataIn.length; i++){
      barang[i] = dataIn[i].barang.split(";");
      var id = [];
      var jml = [];
      dataIn[i].ttl_harga = 0;
      dataIn[i].pcs = "";
      for(let j = 0; j < barang[i].length; j++){
          id[j] = barang[i][j].split(",")[0];
          jml[j] = barang[i][j].split(",")[1];
          hoboken(dataIn[i], id[j], jml[j]);
      }
  }
}

exports.sendMail = function(from, pass, to, subject, text){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: from,
          pass: pass
        }
      });
      
      var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
          console.log('mail')
        if (error) {
          console.log(error);
        }else{
          console.log('Email sent: ' + info.response);
        }
      });
}

exports.sendMailAccount = function(targetMail,  password, role){
    var namaSoftware = ""
    var html = "<div>Email : "+ targetMail +"</div><div>Password : "+ password +"</div>";
    exports.sendMail("faridabdul140601@gmail.com", "pse-305ga", targetMail, "Slip Pembayaran", html);
}