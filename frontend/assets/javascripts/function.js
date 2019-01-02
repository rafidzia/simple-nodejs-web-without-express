function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
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

function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function removeElements(node){
    node.parentNode.removeChild(node);
}

function tableFixer(table, container){
    window.onload = function(){
        table.style.width = container.offsetWidth + "px";
    }
    window.onresize = function(){
        table.style.width = "";
        table.style.width = container.offsetWidth + "px";
    }
}
function setLink(selector, container, after){
        var aEl = document.querySelectorAll(selector);
        for(this.j = 0; j< aEl.length; j++){
            aEl[j].onclick = function(e){
                e.preventDefault();
                container.innerHTML = "";
                closeSlide();
                var target  =  e.target.parentElement.href;
                history.pushState("","",target);
                after();
            }
        }
    }



function rupiahToNumber(a){
    this.rpSplit;
    this.rpSplit1;
    this.lastRpSplit;
    this.number;
    rpSplit        =  a.split(".");
    rpSplit.splice(0,1);
    rpSplit1       = rpSplit[rpSplit.length - 1].split(",");
    rpSplit1.splice(1,1);
    lastRpSplit    = rpSplit1.join("");
    rpSplit.splice(rpSplit.length -1,1);
    rpSplit        = rpSplit.join("");
    number         = rpSplit + lastRpSplit;
    return parseInt(this.number);
}
function numberToRupiah(a , ket=true){
    this.numStr = String(a);
    this.b = [];
    this.i;
    this.j;
    this.k;
    numStr = numStr.replace(/\./g, "");
    if((numStr.length % 3) == 1){
        i = 1; j = 1; k = 4;
        b[0] = numStr.slice(0, 1)
    }else if((numStr.length % 3) == 2){
        i = 1; j = 2; k = 5;
        b[0] = numStr.slice(0, 2);
    }else{
        i = 0; j = 0; k = 3;
    }
    while(i < numStr.length/3){
        b[i] = numStr.slice(j, k);
        i++;
        j+=3;
        k+=3;
    }
    this.c = b.join(".");
    if(ket === true){
    this.c = "Rp." + c + ",-";}
    return this.c;
}

var sendAjax = function(type, url, cache, header, data, success){
    var xhr = new XMLHttpRequest();
    if(cache){
      xhr.open(type, url + ((/\?/).test(url) ? "&" : "?") + (new Date().getTime()));
    }else{
      xhr.open(type, url);
    }
    if(header){
      for(var i = 0; i < header.length; i++){
          xhr.setRequestHeader(header[i][0], header[i][1]);
      }
    }
    if(data){
        xhr.send(data)
    }else{
        xhr.send();
    }
    xhr.onreadystatechange = function(){
        if((this.status == 200) && (this.readyState == 4)){
            success(this.response);
        }
    }
}




