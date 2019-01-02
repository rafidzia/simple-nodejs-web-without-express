const path = require('path'), 
      fs = require('fs');

exports.getStatic = function(filePath, res){
let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.woff2': 'application/font-woff2',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': contentType});
    fs.access(filePath, function(err){
        if(!err){
            fs.createReadStream(filePath).pipe(res); 
        }else{
            console.log(err);
            res.end();
        }
    });
}