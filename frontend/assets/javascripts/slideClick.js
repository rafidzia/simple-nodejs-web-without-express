var cover = document.getElementById("black-cover");
var main = document.getElementsByTagName("main");
var nav = document.getElementsByTagName("nav");

function closeSlide(){
    this.cart = document.getElementById("cart");
    this.search = document.getElementById("search");
    this.cart.className = "clickA";
    this.search.className = "clickA"; 
    cover.style.display = "none";
     main[0].style.filter = "none";
     nav[0].style.filter = "none";
}

function slideClick(cat){
    var select = document.getElementById(cat);
        if(select.className == "clickA"){
            cover.style.display = "block";
            main[0].style.filter = "blur(5px)";
            nav[0].style.filter = "blur(5px)";
            select.className = "clickB";
        }else{
            cover.style.display = "none";
            select.className = "clickA";
        }
}
