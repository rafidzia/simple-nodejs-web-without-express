var container = document.getElementsByClassName('container')[0];

var request = {};
request.getData = function(){
    sendAjax("GET", window.location.pathname, true, [['accept', 'json']], undefined, function(data){
        data = JSON.parse(data);
        container.innerHTML = "";
        var gridId = 0;
        var pathName = window.location.pathname;
        var pathId = "[0-9]+";
        var cat = ['merchandise', 't-shirt', 'woodcraft', 'nursery', 'culinary', 'machine', 'compost', 'welding' ];
        var category = "";
        for(var i = 0; i < cat.length; i++){
        category += "/"+cat[i]+"|"}
        category = category.slice(0, -1);
        category = new RegExp(category);
        var details = new RegExp("/detail/" + pathId);
        var search = /(\/search\/)(\w+)?/;

        if(pathName == "/"){
            this.appendHomeContent = function(type, newEl){
                var parent = document.getElementById(type);
                if(parent){
                if(parent.children.length <= 12)
                    {parent.insertBefore(newEl, parent.children[1])}
                }else{
                    var newField = document.createElement("FIELDSET");
                    var legend = document.createElement("LEGEND");
                    legend.innerHTML = capitalize(type);
                    newField.id = type;
                    newField.className = "field-cat"
                    newField.appendChild(legend);
                    newField.appendChild(newEl);
                    var more = document.createElement("A");
                    more.innerHTML = "<div class='grid-box more'><span>More.. </span> <span class='fa fa-arrow-right' ></span></div>";
                    more.href = "/" + type;
                    newField.appendChild(more);
                    container.appendChild(newField);

                }
            }

            for(var i = 0; i < data.length; i++){
                var newEl = document.createElement("DIV");
                newEl.id = "grid" + String(gridId);
                newEl.className = "grid-box";
                var text =
                    '<div class="hidden">'+ data[i].id_brg +'</div>' +
                    '<a class="link-det" href="/detail/'+data[i].id_brg+'">'  +
                    '<div class="grid-image" style="background-image:   url(assets/images/barang/'+data[i].gambar_brg+')"></div>' +
                    '<div class="text judul">'+data[i].nama_brg+'</div>' +
                    '</a>' +
                    '<div class="text toko">'+data[i].toko_brg+'</div>' +
                    '<div class="text   harga">'+numberToRupiah(data[i].harga_brg)+'</div>' +
                    '<div class="hidden">'+data[i].jumlah_brg+'</div>' +
                    '<a id="beli'+gridId+'" onclick="gridBeli(event)"> <div class="btn-grid">Beli</div></a>';
                newEl.innerHTML = text;
                this.appendHomeContent(data[i].jenis_brg, newEl);
                gridId++;
            }
            setLink("main.container .more", container, request.getData);
            setLink("main.container .link-det", container, request.getData);
            var morLink = document.querySelectorAll('.more');
            for(var i = 0; i < document.querySelectorAll('.more').length; i++){
                morLink[i].style.height = document.querySelector(".grid-box").clientHeight + "px";
                morLink[i].style.lineHeight = parseInt(document.querySelector(".grid-box").clientHeight) + "px";
            }
            window.onresize = function(){
                for(var i = 0; i < document.querySelectorAll('.more').length; i++){
                    morLink[i].style.height = document.querySelector(".grid-box").clientHeight + "px";
                    morLink[i].style.lineHeight = parseInt(document.querySelector(".grid-box").clientHeight) + "px";
                }
            }

        }else if(category.test(pathName)){
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
                    '<div class="hidden">'+data[i].jumlah_brg+'</div>' +
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
            setLink("main.container .link-det", container, request.getData);
        }else if(details.test(pathName)){
          data = data[0];
          var newEl = document.createElement("DIV");
          newEl.className = "detail";
          var text =
              '<img class="detail-image inline-top" src="assets/images/barang/'+data.gambar_brg+'" >' +
                '<fieldset class="detail-item detail-main inline-top">'+
                  '<legend>'+data.nama_brg+'</legend>' +
                    '<div class="hidden">'+data.id_brg+'</div>' +
                       '<div class="detail-content">' +
                         '<div>'+data.toko_brg+'</div>' +
                         '<div>'+numberToRupiah(data.harga_brg)+'</div>' +
                         '<div>Stock tersisa '+data.jumlah_brg+' lagi</div>' +
                         '<div><input id="input-jumlah" type="number" min="1" max="'+data.jumlah_brg+'" value="1"/></div>' +
                         '<div class="hidden">'+ data.jumlah_brg +'</div>' +
                         '<div><button onclick="detailBeli(event)" type="submit">Beli</button></div>'+
                       '</div>' +
                '</fieldset>' +
                '<fieldset class="detail-item">' +
                    '<legend>Description</legend>' +
                    '<div class="detail-content">' +
                      '<table>' +
                        '<tr><td>Nama Barang </td><td> : </td><td>'+data.nama_brg+'</td></tr>' +
                        '<tr><td>Kategori Barang </td><td> : </td><td>'+data.jenis_brg+'</td></tr>' +
                        '<tr><td>Berat Barang </td><td> :  </td><td>'+data.berat_brg+' gram</td></tr>' +
                      '</table>' +
                      '<br/>' +
                      '<p>'+data.deskripsi_brg+'</p>'+
                    '</div>' +
                '</fieldset>';
        newEl.innerHTML = text;
        container.appendChild(newEl);
        var inputJumlah = document.getElementById("input-jumlah");
        inputJumlah.onchange = function(e){
            this.value = inputJumlah.value;
            if(this.value < 1){
              this.value = 1;
            }else if(this.value > data.jumlah_brg){
              this.value = data.jumlah_brg;
            }
          }
        }else if(search.test(pathName)){
          if((data.length > 0) && (/(\/search\/)\w+/.test(window.location.pathname))){
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
                    '<div class="hidden">'+data[i].jumlah_brg+'</div>' +
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
            setLink("main.container .link-det", container, request.getData);
          }else{
              var newFieldset = document.createElement("FIELDSET");
              newFieldset.className = "field-cat";
              newFieldset.style.padding = "50px";
              newFieldset.innerHTML = "Sorry, Result not Found";
              container.appendChild(newFieldset);
          }
        }

    });
    
}

window.onpopstate = function(e){
    e.preventDefault();
    closeSlide();
    request.getData();
}


request.getData();
setLink("#search .link-cat", container, request.getData);

