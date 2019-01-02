var cover = document.getElementById("black-cover");
var main = document.getElementsByTagName("main")[0];
var nav = document.getElementsByTagName("nav")[0];
function hoverClick(cat){
  var select = document.getElementById(cat);
  if(select.style.display == "block"){
    select.style.display = "none";
  }else{
    select.style.display = "block";
  }
}

function closeSlide(){
    this.menu = document.getElementById("menu");
    this.menu.className = "clickA";
    cover.style.display = "none";
    main.style.filter = "none";
    nav.style.filter = "none";
}

function slideClick(cat){
    var select = document.getElementById(cat);
        if(select.className == "clickA"){
            cover.style.display = "block";
            main.style.filter = "blur(5px)";
            nav.style.filter = "blur(5px)";
            select.className = "clickB";
        }else{
            cover.style.display = "none";
            select.className = "clickA";
        }
        if(document.getElementById('dropmenu').style.display == "block"){
          hoverClick('dropmenu');
        }
}


function logout(){
  setCookie("username", "");
  setCookie("password", "");
  setCookie("name", "");
  window.location = "/login";
}


function accPesan(e,id){
  var rc = confirm('Terima Pesanan?')
  if(rc){
    sendAjax("PUT", "/acceptPesan", false, [['accept','json']], JSON.stringify(id), function(data){
      getData();
    });
  }
}

function dcPesan(e,id){
  var rc = confirm('Tolak Pesanan?')
  if(rc){
    sendAjax("PUT", "/declinePesan", false, [['accept','json']], JSON.stringify(id), function(data){
      getData();
    });
  }
}

function accKirim(e, id){
  var rc = confirm('Anda yakin pesanan sudah dikirim?')
  if(rc){
    sendAjax("PUT", "/terkirim", false, [['accept', 'json']], JSON.stringify(id), function(data){
      getData();
    })
  }
}

function createModal(id, text, contQ, success){
    var modal = document.createElement("div");
    modal.id = id;
    modal.className = "modal";
    var defText = text;
    modal.innerHTML = defText;
    if(document.getElementById(id)){
      removeElements(document.getElementById(id));
    }
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(modal, document.getElementById('black-cover'));
    modal = document.getElementById(id);
    window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
          cover.style.display = "none";
          main.style.filter = "none";
          nav.style.filter = "none";
      }
  }
    var modalCont = document.querySelector(contQ);
        cover.style.display = "block";
        modal.style.display = "block";
        main.style.filter = "blur(5px)";
        nav.style.filter = "blur(5px)";
        var nMarg = 50 - (50 / (window.innerHeight / modalCont.clientHeight));
        if(modalCont.clientHeight < window.innerHeight){
          modal.style.paddingTop = window.innerHeight * (nMarg/100) + "px";
        }else{
          modal.style.paddingTop = 0;
        }
        success();
}

function closeModal(id, e){
    document.getElementById(id).style.display = "none";
    cover.style.display = "none";
    main.style.filter = "none";
    nav.style.filter = "none";
}
function defTextForModalSiswa(){
  var defText = 
        '<div class="modal-content">' +
        '<form method="post">'+
        '<div class="modal-header"><span class="close">&times;</span><h2 class="title">Pendaftaran Siswa</h2></div>' +
        '<div class="modal-body">' +
        '<input type="text" name="name" placeholder="Nama" required/><br>'+
        '<select name="class"/><option id="defaultClass">Tingkatan</option><option>X / 10</option><option>XI / 11</option><option>XII / 12</option></select><br>'+
        '<select name="majors"/>'+
        '<option id="defaultMajors">Jurusan</option>' +
        '<option>Teknik Elektronika Daya dan Komunikasi</option>' +
        '<option>Teknik Otomasi Industri</option>' +
        '<option>Teknik Pemesinan</option>' +
        '<option>Teknik Komputer dan Jaringan</option>' +
        '<option>Teknik Pengelasan</option>' +
        '<option>Teknik Mekatronika</option>' +
        '</select><br>' +
        '<input type="text" name="shop" placeholder="Nama Toko" required/><br>'+
        '<input type="text" name="username" placeholder="Username" required/><br>'+
        '<input type="password" name="password" placeholder="Password" required/><br>'+
        '</div>' +
        '<div class="modal-footer" style="text-align:right"><button class="btn-a" >Daftar </button> <input type="button" class="btn-a" value="Batal"></div>' +
        '</form>'+
        '</div>';
        return defText;
}
function editSiswa(e, data){
  var defText = defTextForModalSiswa();
  createModal('modalEdit', defText, "#modalEdit .modal-content", function(){
    document.querySelector("#modalEdit form").id = "formEdit";
    document.querySelector("#modalEdit .title").innerHTML = "Edit Siswa";
    document.querySelector('#modalEdit .modal-header .close').onclick = function(){closeModal('modalEdit')}
    document.querySelector('#modalEdit .modal-footer input').onclick = function(){closeModal(`modalEdit`)}
    var formSiswa = document.getElementById('formEdit');
    formSiswa.elements.namedItem('class').children[0].id = "defaultClassEdit";
    removeElements(document.getElementById('defaultClassEdit'))
    
    formSiswa.elements.namedItem('majors').children[0].id = "defaultMajorsEdit";
    removeElements(document.getElementById('defaultMajorsEdit'))
    
    formSiswa.elements.namedItem('name').value = data.name;
    formSiswa.elements.namedItem('class').value = data.class;
    formSiswa.elements.namedItem('majors').value = data.majors;
    formSiswa.elements.namedItem('shop').value = data.shop;

    formSiswa.onsubmit = function(e){
      e.preventDefault();
      var objData = {};
      for(var i = 0; i < formSiswa.elements.length - 2; i++){
        objData[String(formSiswa.elements[i].name)] = formSiswa.elements[i].value;
      }
      objData['id_user'] = data.id_user; 
      sendAjax("PUT", "/editSiswa", false, [['accept', 'json']], JSON.stringify(objData), function(data){
        closeModal('modalEdit');
        getData();
      })
    }
  })
}

function deleteSiswa(e, id){
  var rc = confirm("Hapus User?");
  if(rc){
    sendAjax("DELETE", "/deleteSiswa", false, [['accept', 'json']], JSON.stringify(id), function(data){
      getData();
    })
  }
}

function defTextForModalBarang(){
  var defText = 
        '<div class="modal-content">' +
        '<form name="tambahBrg" method="post" enctype="multipart/form-data">'+
        '<div class="modal-header"><span class="close">&times;</span><h2 class="title">Tambah Siswa</h2></div>' +
        '<div class="modal-body">' +
        '<input type="text" name="nama" placeholder="Nama Barang" required/><br>'+
        '<select name="jenis"/>'+
        '<option id="defaultJenis">Jenis Barang</option>' +
        '<option>Merchandise</option>' +
        '<option>T-shirt</option>' +
        '<option>Woodcraft</option>' +
        '<option>Nursery</option>' +
        '<option>Culinary</option>' +
        '<option>Machine</option>' +
        '<option>Compost</option>' +
        '<option>Welding</option>' +
        '</select><br>' +
        '<input type="text" onkeyup="pointed(event)" name="jumlah" placeholder="Jumlah Barang" required/><span> pcs</span><br>'+
        '<input type="text" onkeyup="pointed(event)" name="berat" placeholder="Berat Barang" required/><span> gram</span><br>'+
        '<textarea name="deskripsi" placeholder="Deskripsi Barang" required></textarea><br>'+
        '<span style="margin-left:24px;">Rp. </span><input type="text" onkeyup="pointed(event)" name="harga" placeholder="Harga Barang" required/><br>'+
        '<input type="file" name="gambar" placeholder="Gambar Barang" required/><br>'+
        '</div>' +
        '<div class="modal-footer" style="text-align:right"><button class="btn-a" >Daftar </button> <input type="button" class="btn-a" value="Batal"></div>' +
        '</form>'+
        '</div>';
        return defText;
}

function pointed(e){
  var a = e.target.value;
  a = String(a);
  a = a.replace(/\./gi, "");
  a = parseInt(a)
  if((a % 1) != 0){
    e.target.value = "";
  }else{
    e.target.value = numberToRupiah(a, false);
  }
}

function numbered(elVal){
  var a = String(elVal);
  a = a.split(".");
  a = a.join("");
  return a;
}

function editBarang(e, data){
  var defText = defTextForModalBarang();
  createModal('modalEdit', defText, "#modalEdit .modal-content", function(){
    document.querySelector("#modalEdit form").id = "formEdit";
    document.querySelector("#modalEdit .title").innerHTML = "Edit Barang";
    document.querySelector('#modalEdit .modal-header .close').onclick = function(){closeModal('modalEdit')}
    document.querySelector('#modalEdit .modal-footer input').onclick = function(){closeModal(`modalEdit`)}
    var formBarang = document.getElementById('formEdit');
    formBarang.enctype = "";

    formBarang.elements.namedItem('gambar').id = "gambarInEdit";
    removeElements(document.getElementById('gambarInEdit'))

    formBarang.elements.namedItem('jenis').children[0].id = "defaultJenisEdit";
    removeElements(document.getElementById('defaultJenisEdit'))

    formBarang.elements.namedItem('nama').value = data.nama_brg;
    formBarang.elements.namedItem('jenis').value = capitalize(data.jenis_brg);
    formBarang.elements.namedItem('jumlah').value = numberToRupiah(data.jumlah_brg, false);
    formBarang.elements.namedItem('berat').value = numberToRupiah(data.berat_brg, false);
    formBarang.elements.namedItem('deskripsi').innerHTML = data.deskripsi_brg;
    formBarang.elements.namedItem('harga').value = numberToRupiah(data.harga_brg, false);

    

    formBarang.onsubmit = function(e){
      e.preventDefault();
      formBarang['jumlah'].value = numbered(formBarang['jumlah'].value)
      formBarang['berat'].value = numbered(formBarang['berat'].value)
      formBarang['harga'].value = numbered(formBarang['harga'].value)
      formBarang['jenis'] = formBarang['jenis'].value.toLowerCase();

      var objData = {};
      for(var i = 0; i < formBarang.length -2; i++){
        objData[String(formBarang.elements[i].name)] = formBarang.elements[i].value;
      }
      objData['id_brg'] = data.id_brg;
      sendAjax("PUT", "/editBarang", false, [['accept', 'json']], JSON.stringify(objData), function(data){
        closeModal('modalEdit');
        getData();
      })
    }
  })
}

function deleteBarang(e, id){
  var rc = confirm("Hapus Barang?");
  if(rc){
    sendAjax("DELETE", "/deleteBarang", false, [['accept', 'json']], JSON.stringify(id), function(data){
      getData();
    })
  }
}


document.getElementById('name').textContent = getCookie("name");

