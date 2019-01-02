var container = document.getElementsByClassName('container')[0];

var getData = function(){
  var path = window.location.pathname;
  sendAjax("GET", path, true, [['accept', 'json']], undefined, function(data){
    data = JSON.parse(data);
    container.innerHTML = "";
    if(path == "/admin" || path == "/admin/"){
    var defText = 
    '<div class="indikator">'+
      '<fieldset class="field-cat indicat">'+
        '<legend>Siswa</legend>' +
        '<span class="fa fa-users fa-3x"></span>'+
        '<span id="ttl-siswa" class="point">123</span>'+
      '</fieldset>'+
      '<fieldset class="field-cat indicat">'+
        '<legend>Penjualan</legend>'+
        '<span class="fa fa-shopping-cart fa-3x"></span>'+
        '<span id="ttl-jual" class="point">123</span>'+
      '</fieldset>'+
      '<fieldset class="field-cat indicat">'+
        '<legend>Barang</legend>'+
        '<span class="fa fa-inbox fa-3x"></span>'+
        '<span id="ttl-brg" class="point">123</span>'+
      '</fieldset>'+
      '<fieldset class="field-cat indicat">'+
        '<legend>Omset</legend>'+
        '<span class="fa fa-money fa-3x"></span>'+
        '<span  id="ttl-omset" class="point">123</span>'+
      '</fieldset>'+
      '</div>'+
      '<div>'+
        '<fieldset class="field-cat fladash">'+
          '<legend>Pesanan</legend>'+
          '<div><table class="tbl">'+
              '<thead><tr><th>Nama</th><th>Nomor Hp</th><th>Total</th></tr></thead>'+
              '<tbody id="pesanan">'+

              '</tbody>'+
            '</table>'+
          '</div>'+
        '</fieldset>'+
      '</div>';
        container.innerHTML = defText;
        document.getElementById('ttl-siswa').innerHTML = data.ttlSiswa;
        document.getElementById('ttl-jual').innerHTML = data.ttlJual;
        document.getElementById('ttl-brg').innerHTML = data.ttlBrg;
        document.getElementById('ttl-omset').innerHTML = numberToRupiah(data.ttlOmset);

        if(data.listPesan == false){
          document.getElementById("pesanan").innerHTML = '<td colspan=3>Maaf, belum ada pesanan baru</td>';
        }else{
          for(var i = 0; i < data.listPesan.length;i++){
            var pesan = data.listPesan;
            var newEl = document.createElement('TR');
            var apCd = '<td>'+ pesan[i].nama_pemesan +'</td><td>'+ pesan[i].nomor_hp +'</td><td>'+ numberToRupiah(pesan[i].ttl_harga) +'</td>';
            newEl.innerHTML = apCd;
            document.getElementById('pesanan').appendChild(newEl)
          }
        }
    }else if(path == "/admin/pesanan" || path == "/admin/pesanan/"){
      var defText = 
      '<div>'+
        '<fieldset class="field-cat fladash">'+
          '<legend>Pesanan</legend>'+
          '<div><table class="tbl list-tbl" >'+
              '<thead><tr></tr></thead>'+
              '<tbody id="pesanan">' +
                
              '</tbody>'+
            '</table>'+
          '</div>'+    
        '</fieldset>'+
      '</div>';
      container.innerHTML = defText;
      if(data.listPesan == false){
        document.getElementById("pesanan").innerHTML = '<div>Maaf, belum ada pesanan</div>';
      }else{
        for(var i = 0; i < data.listPesan.length;i++){
          var pesan = data.listPesan;
          var newEl = document.createElement('TR');
          var apCd = '<th style="border:none;text-align:left;font-size:20px;">'+ pesan[i].nama_pemesan +'</th>';
          newEl.innerHTML = apCd;
          var newEl1 = document.createElement('TR');
          var bpCd = 
          '<td id="td'+ i +'" class="tdList" style="text-align:left;padding-left:20px">' +
                'Email : '+ pesan[i].email +'<br/>' +
                'Nomor HP : '+ pesan[i].nomor_hp +'<br/>' +
                'Instansi : '+ pesan[i].nama_instansi +'<br/>' +
                'Alamat : '+ pesan[i].alamat + ', kel.' + pesan[i].kelurahan + ', kec.' + pesan[i].kecamatan + ' ' + pesan[i].kota + ', ' + pesan[i].provinsi + ', ' + pesan[i].nomor_pos +'<br/>' +
                'Pesanan : <br/>' +
                '<ul id="as'+ i +'">'+
                '</ul>' +
                'Kurir : '+ pesan[i].kurir.split(";").shift() +' dengan paket '+ pesan[i].kurir.split(";").pop() +' ('+ pesan[i].ongkir.split(";").pop() +' hari)<br/>' +
                'Ongkir : '+ numberToRupiah(pesan[i].ongkir.split(";").shift()) +'<br/>' +
                'Total : '+ numberToRupiah(pesan[i].ttl_harga) +'<br/>' +
                'Deskripsi : '+ pesan[i].deskripsi +'<br/>' +
                'Bukti Pembayaran : <a target="_blank" href="/assets/images/pesan/'+ pesan[i].foldername +'/'+pesan[i].filename +'">Click Here</a><br/><br/>' +
          '</td>';
          newEl1.innerHTML = bpCd;
          document.getElementById('pesanan').appendChild(newEl);
          document.getElementById('pesanan').appendChild(newEl1);
          var newEl2 = document.createElement('div');
          if(pesan[i].status == 'n'){
            newEl2.innerHTML = '<div><a class="btn-a" onclick="accPesan(event,' + pesan[i].id_pesan + ')">Accept</a> <a class="btn-a" onclick="dcPesan(event,' + pesan[i].id_pesan + ')">Decline</a></div>';
            document.getElementById('td' + i).appendChild(newEl2)
          }else if(pesan[i].status == 'y'){
            if(pesan[i].statAcc == "b"){
              newEl2.innerHTML = '<div><span style="color:tomato">*Barang Belum Dikirim! </span><a class="btn-a" onclick="accKirim(event,' + pesan[i].id_pesan + ')">Tandai sudah dikirim</a></div>';
              document.getElementById('td' + i).appendChild(newEl2)
            }else if(pesan[i].statAcc == "s"){
              newEl2.innerHTML = '<div style="color:tomato">*Barang sudah dikirim!</div>';
              document.getElementById('td' + i).appendChild(newEl2)
            }
          }

          var pcs = pesan[i].pcs.split(";");
          pcs.pop();
          for(var j = 0; j < pcs.length;j++){
            var idPcs = pcs[j].split(',')[0];
            var jmlPcs = pcs[j].split(',')[1];
            var hrgPcs = pcs[j].split(',')[2];
            var nmPcs = pcs[j].split(',')[3];
            var newEl3 = document.createElement("li");
            newEl3.innerHTML = capitalize(nmPcs) + ' (' + jmlPcs + ' x ' + numberToRupiah(hrgPcs) + ') = ' + numberToRupiah(parseInt(jmlPcs) * parseInt(hrgPcs));
            document.getElementById('as' + i).appendChild(newEl3)
          }
        }
      }
    }else if(path == "/admin/siswa" || path == "/admin/siswa/"){
      var defText = 
      '<div>'+
        '<fieldset class="field-cat fladash">'+
          '<legend>Siswa</legend>'+
          '<div><table class="tbl list-tbl" >'+
              '<thead><tr></tr></thead>'+
              '<tbody id="siswa">' +
                
              '</tbody>'+
            '</table>'+
          '</div>'+    
        '</fieldset>'+
      '</div>' +
      '<a style="font-size:30px" id="tambah-siswa" class="fa fa-plus"></a>';
      container.innerHTML = defText;
      if(data.listSiswa == false){
        document.getElementById("siswa").innerHTML = 'Tidak terdaftar siswa';
      }else{
        for(var i = 0; i < data.listSiswa.length;i++){
          var siswa = data.listSiswa;
          var newEl = document.createElement('TR');
          var apCd = '<th style="border:none;text-align:left;font-size:20px;">'+ siswa[i].name +'</th>';
          newEl.innerHTML = apCd;
          var newEl1 = document.createElement('TR');
          var bpCd = 
          '<td style="text-align:left;padding-left:20px">' +
                'Id : '+ siswa[i].id_user +'<br/>' +
                'Jurusan : '+ siswa[i].majors +'<br/>' +
                'Kelas : '+ siswa[i].class +'<br/>' +
                'Toko : '+ siswa[i].shop +'<br/><br/>' +
                "<div><a onclick='editSiswa(event," + JSON.stringify(siswa[i]).replace(/\'/gi, "\\`") + ")' class='btn-a'>Edit</a> <a class='btn-a' onclick='deleteSiswa(event," + siswa[i].id_user + ")'>Delete</a></div>" +    
                '</td>';
          newEl1.innerHTML = bpCd;
          document.getElementById('siswa').appendChild(newEl);
          document.getElementById('siswa').appendChild(newEl1);
        }
      var defText = defTextForModalSiswa()
      document.getElementById("tambah-siswa").onclick = function(e){
        createModal('modalTambah', defText, '#modalTambah .modal-content', function(){
          document.querySelector("#modalTambah form").id = "formTambah";
          document.querySelector('#modalTambah .modal-header .close').onclick = function(){closeModal('modalTambah')}
          document.querySelector('#modalTambah .modal-footer input').onclick = function(){closeModal(`modalTambah`)}
          document.querySelector('#modalTambah .modal-header .title').innerHTML = "Pendaftaran Siswa"
          var formSiswa = document.getElementById('formTambah')
          formSiswa.elements.namedItem('class').children[0].id = "defaultClassTambah";
          formSiswa.elements.namedItem('class').onchange = function(e){
            if(formSiswa.elements.namedItem('class').children.length == 4){
              removeElements(document.getElementById('defaultClassTambah'))
            }
          }
          formSiswa.elements.namedItem('majors').children[0].id = "defaultMajorsTambah";
          formSiswa.elements.namedItem('majors').onchange = function(e){
            if(formSiswa.elements.namedItem('majors').children.length == 7){
              removeElements(document.getElementById('defaultMajorsTambah'))
            }
          }
          formSiswa.onsubmit = function(e){
            e.preventDefault();
            var objData = {};
            for(var i = 0; i < formSiswa.elements.length - 2; i++){
              objData[String(formSiswa.elements[i].name)] = formSiswa.elements[i].value;
            } 
            sendAjax("POST", "/tambahSiswa", false, [['accept', 'json']], JSON.stringify(objData), function(data){
              closeModal('modalTambah');
              getData();
            })
          }
        });
      }

      }
    }
  })
}

window.onpopstate = function(e){
  e.preventDefault();
  closeSlide();
  getData();
}

getData();
setLink('.link-cat', container, getData);