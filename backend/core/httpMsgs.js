const settings = require("../database/settings");
const fs = require('fs');

exports.show404 = (req, res)=>{
    if(settings.httpMsgsFormat === "HTML"){
        res.writeHead(404, "RESOURCE NOT FOUND", {"Content-Type": "text/html"});
        res.write("<html><head><title>404</title></head><body>404: RESOURCE NOT FOUND.</body></html>")
    }else{
        res.writeHead(404, "RESOURCE NOT FOUND", {"Content-Type": "application/json"});
        res.write(JSON.stringify({data: "ERROR"}));
    }
    res.end();
}

exports.show405 = (req, res)=>{
    if(settings.httpMsgsFormat === "HTML"){
        res.writeHead(405, "METHOD NOT SUPPORTED", {"Content-Type": "text/html"});
        res.write("<html><head><title>405</title></head><body>405: METHOD NOT SUPPORTED.</body></html>")
    }else{
        res.writeHead(405, "METHOD NOT SUPPORTED", {"Content-Type": "application/json"});
        res.write(JSON.stringify({data: "ERROR"}));
    }
    res.end();
}

exports.show413 = (req, res)=>{
    if(settings.httpMsgsFormat === "HTML"){
        res.writeHead(413, "RQUEST ENTITY TOO LARGE", {"Content-Type": "text/html"});
        res.write("<html><head><title>413</title></head><body>413: REQUEST ENTITY TOO LARGE.</body></html>")
    }else{
        res.writeHead(413, "RQUEST ENTITY TOO LARGE", {"Content-Type": "application/json"});
        res.write(JSON.stringify({data: "ERROR"}));
    }
    res.end();
}

exports.show500 = (req, res, err)=>{
    if(settings.httpMsgsFormat === "HTML"){
        res.writeHead(500, "INTERNAL SERVER ERROR", {"Content-Type": "text/html"});
        res.write("<html><head><title>500</title></head><body>500: INTERNAL ERROR. details : "+err+"</body></html>")
    }else{
        res.writeHead(500, "INTERNAL SERVER ERROR", {"Content-Type": "application/json"});
        res.write(JSON.stringify({data: "ERROR occured : " + err}));
    }
    res.end();
}

exports.send200 = (req, res)=>{
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end();
}

exports.sendJson = (req, res, data)=>{
    res.writeHead(200, {"Content-Type": "application/json"});
    if(data){
        res.write(JSON.stringify(data));
    }
    res.end();
}



