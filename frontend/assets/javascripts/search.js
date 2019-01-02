var searchForm = document.getElementById('search-form');
searchForm.onsubmit = function(e){
  e.preventDefault();
  closeSlide();
}
searchForm.onkeyup = function(e){
    e.preventDefault();
    var formValue = searchForm.children[0].value;
    var container = document.getElementsByClassName("container")[0];

    sendAjax("GET", "/search/"+ formValue, true, [['accept', 'json']], undefined, function(data){
    container.innerHTML = "";
    data = JSON.parse(data);
    if(/(\/search\/)(\w+)?/.test(window.location.pathname)){
      history.replaceState("", "", "/search/" + formValue);
    }else{
      history.pushState("", "", "/search/" + formValue);
    }
    if((data.length > 0) && (/(\/search\/)(\w+)/.test(window.location.pathname))){
      var gridId = 0;
      for(var i = 0; i < data.length; i++){
          var newEl = document.createElement("DIV");
          newEl.id = "grid" + String(gridId);
          newEl.className = "grid-box inline-top";
          var text =
              '<div class="hidden">'+ data[i].id_brg +'</div>' +
              '<a class="link-det" href="/detail/'+data[i].id_brg+'">' +
              '<div class="grid-image" style="background-image:   url(assets/images/barang/'+data[i].gambar_brg+')">  </div>' +
              '<div class="text judul">'+data[i].nama_brg+'</div>' +
              '</a>' +
              '<div class="text toko">'+data[i].toko_brg+'</div>' +
              '<div class="text   harga">'+numberToRupiah(data[i].harga_brg)+'</div>' +
              '<a id="beli'+gridId+'" onclick="gridBeli(event)"> <div class="btn-grid">Beli</div></a>';
          newEl.innerHTML = text;
          var field = document.getElementsByTagName('fieldset')[0];
          if(field){
              field.insertBefore(newEl, field.children[1]);
          }else{
              var newFieldset = document.createElement("FIELDSET");
              newFieldset.className = "field-cat";
              newFieldset.appendChild(newEl);
              container.appendChild(newFieldset);
          }
          gridId++;
      }
      setLink("main.container .link-det");
    }else{
        container.innerHTML = "";
        var newFieldset = document.createElement("FIELDSET");
        newFieldset.className = "field-cat";
        newFieldset.style.padding = "50px";
        newFieldset.innerHTML = "Sorry, Result not Found";
        container.appendChild(newFieldset);
    }
    });
}
