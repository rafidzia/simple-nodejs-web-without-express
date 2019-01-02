const http = require('http');
const qs = require('querystring')
const fs = require('fs');

const emp = require('../controllers/employee');
const main = require('../controllers/mainpage');
const order = require('../controllers/order');
const account = require('../controllers/user');

const settings = require('../database/settings');
const httpReq = require('./httpRequest');
const httpStc = require('./httpStatic');
const httpMsgs = require('./httpMsgs');

var db = require('../database/db.js');


http.createServer(function(req,res){
    req.url = req.url.replace(/\%20/g, " ");
    
    switch(req.method){
        case "GET":
            var assets = /assets\/[\/a-zA-Z0-9\.]+/;

            var root = /(?:^|^\s)(\/)([?][0-9]+)?(?=^\s|$)/;

            var category = /(?:^|^s)(\/?merchandise\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?t-shirt\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?woodcraft\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?nursery\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?culinary\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?machine\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?compost\/?)(\/?[?][0-9]+)?(?=^s|$)|(?:^|^s)(\/?welding\/?)(\/?[?][0-9]+)?(?=^s|$)/;

            var details = /(?:^|^\s)(\/detail\/[0-9]+\/?)(\/?[?][0-9]+)?(?=^\s|$)/;

            var search = /(?:^|\s)(\/search\/)(\w+\/?)?(\/?[?]\d+)?(?=\s|$)/;

            var pesan = /(?:^|\s)(\/pesan)(\/)?(?=\s|$)/;
            var bayar = /(?:^|\s)(\/bayar)(\/)?(?=\s|$)/;

            var login = /(?:^|\s)(\/login)(\/)?(?=\s|$)/;

            var admin = /(?:^|\s)(\/admin)(\/)?([?][0-9]+)?(?=\s|$)/;
            var adminSiswa = /(?:^|\s)(\/admin\/siswa)(\/)?([?][0-9]+)?(?=\s|$)/;
            var adminPesanan = /(?:^|\s)(\/admin\/pesanan)(\/)?([?][0-9]+)?(?=\s|$)/;

            var user = /(?:^|\s)(\/siswa)(\/)?([?][0-9]+)?(?=\s|$)/;
            var userPesanan = /(?:^|\s)(\/siswa\/pesanan)(\/)?([?][0-9]+)?(?=\s|$)/;
            var userBarang = /(?:^|\s)(\/siswa\/barang)(\/)?([?][0-9]+)?(?=\s|$)/;

            var getAP = /(?:^|\s)(\/pesan\/province)(\/)?([?][0-9]+)?(?=\s|$)/;
            var getAC = /(?:^|\s)(\/pesan\/city\/\d+)(\/)?([?][0-9]+)?(?=\s|$)/;
            
            if(assets.test(req.url)){
                var staticPath = req.url.split("/");
                staticPath.splice(1, staticPath.indexOf('assets') - 1);
                req.url = staticPath.join("/");
                httpStc.getStatic("./frontend" + req.url, res);
            }else if(root.test(req.url)){
                httpReq.htmlAndJson(req, function(){
                    httpReq.showHome(req, res)
                }, function(){
                    main.getAll(req, res);
                });
            }else if(details.test(req.url)){
                httpReq.htmlAndJson(req, function(){
                    httpReq.showHome(req, res);
                }, function(){
                    var id = req.url.split("?").shift().split("/").pop()
                    main.getDetail(req, res, id);
                });
            }else if(category.test(req.url)){
                httpReq.htmlAndJson(req, function(){
                    httpReq.showHome(req, res);
                }, function(){
                    req.url = req.url.split("?").shift().split("/").pop();
                    main.getCat(req, res, req.url);
                });
            }else if(search.test(req.url)){
                httpReq.htmlAndJson(req, function(){
                    httpReq.showHome(req, res);
                }, function(){
                    req.url = req.url.split("?").shift().split("/").pop();
                    main.getSearch(req, res, req.url);
                });
            }else if(pesan.test(req.url)){
                httpStc.getStatic("./frontend/pesan.html", res);
            }else if(bayar.test(req.url)){
                httpStc.getStatic("./frontend/pesan.html", res);
            }else if(login.test(req.url)){
                httpStc.getStatic("./frontend/login.html", res);
            }else if(admin.test(req.url)){
                httpReq.validateAdmin(req,res, function(){
                  account.admin(req, res);
                });
            }else if(adminSiswa.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    account.adminSiswa(req, res);
                });
            }else if(adminPesanan.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    account.adminPesanan(req, res);
                });
            }else if(user.test(req.url)){
                httpReq.validateUser(req, res, function(id){
                  account.user(req, res, id);
                });
            }else if(userPesanan.test(req.url)){
                httpReq.validateUser(req, res, function(id){
                    account.pesananUser(req, res, id);
                });
            }else if(userBarang.test(req.url)){
                httpReq.validateUser(req, res, function(id){
                    account.lihatBrg(req, res, id);
                });
            }else if(getAP.test(req.url)){
                httpReq.htmlAndJson(req, undefined, function(){
                    httpReq.reqOngkir("/province", req, res, undefined, function(data){
                        data = JSON.parse(data);
                        data = data.rajaongkir;
                        httpMsgs.sendJson(req, res, data.results);
                    })
                });
                
            }else if(getAC.test(req.url)){
                httpReq.htmlAndJson(req, undefined, function(){
                    var id = req.url.split("/")[req.url.split("/").length - 1];
                    httpReq.reqOngkir("/city?province="+id, req, res, undefined, function(data){
                        data = JSON.parse(data);
                        data = data.rajaongkir;
                        httpMsgs.sendJson(req, res, data.results);
                    })
                });
                
            }else{
                httpMsgs.show404(req, res);
            }
            break;
        case "POST":
            var pesan = /(?:^|\s)(\/pesan)(\/)?(?=\s|$)/;
            var pPesan = /(?:^|\s)(\/postPesan)(\/)?(?=\s|$)/;
            var getBayar = /(?:^|\s)(\/getBayar)(\/)?(?=\s|$)/;
            var bayar = /(?:^|\s)(\/bayar)(\/)?(?=\s|$)/;
            var login = /(?:^|\s)(\/login)(\/)?(?=\s|$)/;
            var tambahSiswa = /(?:^|\s)(\/tambahSiswa)(\/)?(?=\s|$)/;
            var tambahBarang = /(?:^|\s)(\/tambahBarang)(\/)?(?=\s|$)/;
            var getCo = /(?:^|\s)(\/pesan\/cost)(\/)?(?=\s|$)/;

            if(pesan.test(req.url)){
                httpReq.reqBody(req, function(data){
                    data = JSON.parse(data);
                    order.getOrder(req, res, data);
                })
            }else if(pPesan.test(req.url)){
                httpReq.reqBody(req, function(data){
                    data = JSON.parse(data);
                    order.postOrder(req, res, data);
                })
            }else if(getBayar.test(req.url)){
                httpReq.reqBody(req, function(data){
                    order.getBayar(req, res, data)
                })
            }else if(bayar.test(req.url)){
                httpReq.reqForm(req, res, "./frontend/assets/images/draft_pesan/", ['payed'], function(data, proceed){
                    order.postBayar(req, res, data, proceed)
                })
            }else if(login.test(req.url)){
                httpReq.reqBody(req, function(data){
                    data = JSON.parse(data);
                    account.login(req, res, data);
                })
            }else if(tambahBarang.test(req.url)){
                httpReq.validateUser(req, res, function(id, shop){
                    httpReq.reqForm(req, res, "./frontend/assets/images/draft_barang/", ['gambar'], function(data, proceed){
                        account.tambahBrg(req, res, id, shop, data, proceed);
                    })
                })
            }else if(tambahSiswa.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data);
                        account.tambahSiswa(req, res, data);
                    })
                })
            }else if(getCo.test(req.url)){
                httpReq.reqBody(req, function(data){
                    data = JSON.parse(data);
                    httpReq.getBerat(data.totBrg, function(berat){
                        httpReq.htmlAndJson(req, undefined, function(){
                            httpReq.reqOngkir("/cost", req, res, [48, data.id, berat, data.kurir.toLowerCase()], function(data){
                                data = JSON.parse(data);
                                data = data.rajaongkir;
                                httpMsgs.sendJson(req, res, data.results);
                            })
                        });
                    });
                })
            }else{
                httpMsgs.show404(req, res);
            }
            ;break;
        case "PUT":
            var acPesan = /(?:^|\s)(\/acceptPesan)(\/)?(?=\s|$)/;
            var dcPesan = /(?:^|\s)(\/declinePesan)(\/)?(?=\s|$)/;
            var editSiswa = /(?:^|\s)(\/editSiswa)(\/)?(?=\s|$)/;
            var editBarang = /(?:^|\s)(\/editBarang)(\/)?(?=\s|$)/;            
            var terkirim = /(?:^|\s)(\/terkirim)(\/)?(?=\s|$)/;            

            if(acPesan.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.acceptPesan(req, res, data);
                    })
                })
            }else if(dcPesan.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.declinePesan(req, res, data);
                    })
                })
            }else if(terkirim.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.accKirim(req, res, data);
                    })
                })
            }else if(editSiswa.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.editSiswa(req, res, data);
                    })
                })
            }else if(editBarang.test(req.url)){
                httpReq.validateUser(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data);
                        account.editBrg(req, res, data);
                    })
                })
            }else{
                httpMsgs.show404(req, res);
            }
            ;break;
        case "DELETE":
        var deleteSiswa = /(?:^|\s)(\/deleteSiswa)(\/)?(?=\s|$)/;
        var deleteBarang = /(?:^|\s)(\/deleteBarang)(\/)?(?=\s|$)/;

            if(deleteSiswa.test(req.url)){
                httpReq.validateAdmin(req, res, function(){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.deleteSiswa(req, res, data);
                    })
                })
            }else if(deleteBarang.test(req.url)){
                httpReq.validateUser(req, res, function(id){
                    httpReq.reqBody(req, function(data){
                        data = JSON.parse(data)
                        account.deleteBrg(req, res, data, id);
                    })
                })
            }else{
                httpMsgs.show404(req, res);
            }
            ;break;
        default: httpMsgs.show404(req, res); break;
    }
}).listen(settings.webPort, ()=>{
    console.log("Server running on port " + settings.webPort);
})

