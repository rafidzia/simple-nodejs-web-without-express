var icount = 0;

window.onload = function () {
    'use strict';
    (localStorage.getItem("cart") === null) ? document.getElementById("slide-cart").innerHTML = '<ul id="parent-cart" class="slide-list"></ul>' : document.getElementById("slide-cart").innerHTML = localStorage.getItem("cart");
    (localStorage.getItem("total") == null) ? document.getElementById("total-cart").children[1].innerHTML = "Rp.0,-" : document.getElementById("total-cart").children[1].innerHTML = localStorage.getItem("total");
    (localStorage.getItem("lastCount") == null) ? icount = 0 : icount = parseInt(localStorage.getItem("lastCount"));

}

var bayar = document.getElementById("bayar");
bayar.onsubmit = function(e){
    e.preventDefault();
    window.location = "/pesan";
}
function countItem(){
    var id_brg = document.getElementsByName("id_brg");
    var jumlah_brg = document.getElementsByName("jumlah_brg");
    var id_brgArr = [];
    var jumlah_brgArr = [];
    for(var i = 0; i < id_brg.length; i++){
        id_brgArr.push(id_brg[i].value);
        jumlah_brgArr.push(jumlah_brg[i].value);
    }
    localStorage.setItem("id_brg", id_brgArr);
    localStorage.setItem("jumlah_brg", jumlah_brgArr);
}

function cartCount(){
    this.parentCart = document.getElementById("parent-cart");
    this.splHarga = []
    this.arrHarga = [];
    this.arrJml = [];
    this.arrTotal = [];
    this.total = 0;
    for(this.i=0; i < this.parentCart.children.length; i++){
        this.cartContent = this.parentCart.children[i].children[2];
        if(this.cartContent.children[3].value > 1){
            this.splHarga[i] = this.cartContent.children[2].innerHTML.split(" X ");
            this.splHarga[i].splice(0,1);
            this.newSplHarga = this.splHarga[i].join("");
            this.arrHarga.push(rupiahToNumber(this.newSplHarga));
        }else{
            this.arrHarga.push(rupiahToNumber(this.cartContent.children[2].innerHTML));
        }
        this.arrJml.push(parseInt(this.cartContent.children[3].value));

        this.arrTotal[i] = this.arrHarga[i] * this.arrJml[i];
        this.total+=this.arrTotal[i];
    }
    this.totalCart = document.getElementById("total-cart").children[1].innerHTML = numberToRupiah(this.total);
}

function moveToCart(mv){
    this.parentCart = document.getElementById("parent-cart");
    this.arrV = [];
    (mv.jumlah)? mv.jumlah : mv.jumlah = 1;

    if(this.parentCart.children.length > 0){
        for(j=0; j < this.parentCart.children.length; j++){
            this.arrV.push(this.parentCart.children[j].children[0].value);
        }
    }

    if(this.arrV.indexOf(mv.id) >= 0){
        this.existId = this.arrV.indexOf(mv.id);
        this.tambahJumlah = parseInt(this.parentCart.children[this.existId].children[2].children[3].value);
        this.tambahJumlah+=parseInt(mv.jumlah);
        (this.tambahJumlah > mv.maxJumlah) ? this.tambahJumlah = mv.maxJumlah : this.tambahJumlah = this.tambahJumlah;
        this.newHarga = this.tambahJumlah + " X " +mv.harga;
        this.parentCart.children[this.existId].children[2].children[2].innerHTML = this.newHarga;
        this.parentCart.children[this.existId].children[2].children[3].value = this.tambahJumlah;
    }else{

        this.newChild = document.createElement("LI");
        this.newChild.id = "li" + icount;
        this.newIsi =
            "<input type='hidden' name='id_brg' value='"+mv.id+"'/>" +
            "<div class='image inline-mid'  style='background-image: url("+mv.image +");'></div>"+
            "<div class='inline-mid'>" +
            "<div class='text judul'>"+ mv.judul +"</div>" +
            "<div class='text toko'>"+ mv.toko +"</div>" +
            "<div class='text harga inline-mid'>"+ mv.jumlah + " X " + mv.harga+"</div>" +
            "<input type='hidden' name='jumlah_brg' value='"+ mv.jumlah +"'/>" +
            "</div>" +
            "<a id='remove"+ icount +"' class='remove-cart' onclick='removeCart(event)'><span class='fa fa-close'></span></a>";

        this.newChild.innerHTML = this.newIsi;
        this.parentCart.appendChild(this.newChild);
        icount++;
    }
    cartCount();
    countItem();
    slideClick("cart");
    this.slideCart = document.getElementById("slide-cart").innerHTML;
    localStorage.setItem("cart", this.slideCart);
    this.totalCart = document.getElementById("total-cart").children[1].innerHTML
    localStorage.setItem("total", this.totalCart);
    localStorage.setItem("lastCount", icount);
}

var gridBeli = function(e){
    this.item = e.target.parentElement.parentElement;
    this.mv ={
        id:this.item.children[0].innerHTML,
        image:this.item.children[1].children[0].style.backgroundImage.slice(4,-1),
        judul:this.item.children[1].children[1].textContent,
        toko:this.item.children[2].textContent,
        harga:this.item.children[3].textContent,
        maxJumlah:this.item.children[4].textContent,
    }
    moveToCart(this.mv);
}

var detailBeli = function(e){
  this.parent = e.target.parentElement.parentElement.parentElement;
  this.detail = parent.children[2];
  this.mv = {
    id: parent.children[1].textContent,
    image: parent.parentElement.children[0].src,
    judul: parent.children[0].textContent,
    toko: detail.children[0].textContent,
    harga: detail.children[1].textContent,
    jumlah: detail.children[3].children[0].value,
    maxJumlah: detail.children[4].textContent,
  }
  moveToCart(this.mv);
}

var removeCart = function(e){
    this.parentLi = e.target.parentElement.parentElement;
    this.parentCart = document.getElementById("parent-cart");
    this.parentCart.removeChild(this.parentLi);
    cartCount();
    countItem();
    this.slideCart = document.getElementById("slide-cart").innerHTML;
    localStorage.setItem("cart", this.slideCart);
    this.totalCart = document.getElementById("total-cart").children[1].innerHTML;
    localStorage.setItem("total", this.totalCart);
    localStorage.setItem("lastCount", icount);
}
