var container = document.getElementsByClassName('container')[0];

var getData = function(){
  var path = window.location.pathname;
  sendAjax("GET", path, true, [['accept', 'json']], undefined, function(data){
    data = JSON.parse(data);
    container.innerHTML = "";
    if(path == "/siswa" || path == "/siswa/"){
      var defText = 
      '<div class="indikator">'+
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
          '<thead><tr><th>Nama</th><th>Nomor HP</th><th>Total</th></tr></thead>'+
          '<tbody id="pesanan">'+
            
          '</tbody>'+
        '</table>'+
      '</div>'+
    '</fieldset>'+
    '<fieldset class="field-cat fladash">' +
        '<legend>Barang yang Terjual</legend>'+
        '<div><table class="tbl"><thead><tr><th></th><th>Nama</th><th>Terjual</th><th>Sisa</th></tr></thead>' +
            '<tbody id="terjual">' +
                
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</fieldset>' +
  '</div>';
      container.innerHTML = defText;
      document.getElementById('ttl-jual').innerHTML = data.ttlJual;
      document.getElementById('ttl-brg').innerHTML = data.ttlBrg;
      document.getElementById('ttl-omset').innerHTML = numberToRupiah(data.ttlOmset);

      if(data.listPesan == false){
        document.getElementById("pesanan").innerHTML = '<td colspan=3>Maaf, belum ada pesanan baru</td>';
      }else{
        var pesan = data.listPesan;
        for(var i = 0; i < data.listPesan.length;i++){
          var newEl = document.createElement('TR');
          var apCd = '<td>'+ pesan[i].nama_pemesan +'</td><td>'+ pesan[i].nomor_hp +'</td><td>'+ numberToRupiah(pesan[i].ttl_harga) +'</td>';
          newEl.innerHTML = apCd;
          document.getElementById('pesanan').appendChild(newEl)
        }
      }

      if(data.listJual == false){
        document.getElementById("terjual").innerHTML = '<td colspan=4>Maaf, belum ada barang Terjual</td>';
      }else{
        var jual = data.listJual;
        for(var i = 0; i < data.listJual.length; i++){
          var newEl = document.createElement('TR');
          var bpCd = '<td><img class="img-produk" src="/assets/images/barang/'+ jual[i].gambar_brg +'" alt=""/></td><td>'+ jual[i].nama_brg +'</td><td>'+ jual[i].terjual_brg +'</td><td>'+ jual[i].jumlah_brg +'</td>';
          newEl.innerHTML = bpCd;
          document.getElementById('terjual').appendChild(newEl);
        }
      }
    }else if(path == "/siswa/pesanan" || path == "/siswa/pesanan/"){
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
        document.getElementById("pesanan").innerHTML = '<div>Maaf, belum ada pesanan<div>';
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
          if(pesan[i].status == 'b'){
            var newEl2 = document.createElement('div');
            newEl2.innerHTML = '<div style="color:tomato">*Barang belum dikirim!</div>';
            document.getElementById('td' + i).appendChild(newEl2)
          }
          var pcs = pesan[i].pcs.split(";");
          pcs.pop();
          for(var j = 0; j < pcs.length;j++){
            var idPcs = pcs[j].split(',')[0];
            var jmlPcs = pcs[j].split(',')[1];
            var hrgPcs = pcs[j].split(',')[2];
            var nmPcs = pcs[j].split(',')[3];
            var newEl3 = document.createElement("li");
            if(data.idPesanan.indexOf(parseInt(idPcs)) >= 0){
              newEl3.style.color = "tomato";
            }
            newEl3.innerHTML = capitalize(nmPcs) + ' (' + jmlPcs + ' x ' + numberToRupiah(hrgPcs) + ') = ' + numberToRupiah(parseInt(jmlPcs) * parseInt(hrgPcs));
            document.getElementById('as' + i).appendChild(newEl3)
          }
        }
      }
    }else if(path == "/siswa/barang" || path == "/siswa/barang/"){
      var defText = 
      '<div>'+
        '<fieldset class="field-cat fladash">'+
          '<legend>Barang</legend>'+
          '<div><table class="tbl list-tbl" >'+
              '<thead><tr></tr></thead>'+
              '<tbody id="barang">' +
                
              '</tbody>'+
            '</table>'+
          '</div>'+    
        '</fieldset>'+
      '</div>' +
      '<a style="font-size:30px" id="tambah-barang" class="fa fa-plus"></a>';
      container.innerHTML = defText;
      if(data.listSiswa == false){
        document.getElementById("barang").innerHTML = 'Belum ada Barang';
      }else{
        for(var i = 0; i < data.listBarang.length;i++){
          var barang = data.listBarang;
          var newEl = document.createElement('TR');
          var apCd = '<th style="border:none;text-align:left;font-size:20px;">'+ capitalize(barang[i].nama_brg) +'</th>';
          newEl.innerHTML = apCd;
          var newEl1 = document.createElement('TR');
          var bpCd = 
          '<td><img style="max-height:200px;max-width:200px" src="/assets/images/barang/'+ barang[i].gambar_brg +'"</td>' +
          '<td style="text-align:left;padding-left:20px">' +
                'Id : '+ barang[i].id_brg +'<br/>' +
                'Jenis : '+ capitalize(barang[i].jenis_brg) +'<br/>' +
                'Harga : '+ numberToRupiah(barang[i].harga_brg) +'<br/>' +
                'Bobot : '+ numberToRupiah(barang[i].berat_brg, false) +' gram<br/>' +
                'Jumlah : '+ numberToRupiah(barang[i].jumlah_brg, false) +' pcs<br/>' +
                'Terjual : '+ numberToRupiah(barang[i].terjual_brg, false) +' pcs<br/>' +
                'Deskripsi : '+ barang[i].deskripsi_brg +'<br/><br/>' +
                "<div><a onclick='editBarang(event," + JSON.stringify(barang[i]).replace(/\'/gi, "\\`") + ")' class='btn-a'>Edit</a> <a class='btn-a' onclick='deleteBarang(event," + barang[i].id_brg + ")'>Delete</a></div>" +    
                '</td>';
          newEl1.innerHTML = bpCd;
          document.getElementById('barang').appendChild(newEl);
          document.getElementById('barang').appendChild(newEl1);
        }

        var defText = defTextForModalBarang();
        document.getElementById('tambah-barang').onclick = function(e){
          createModal('modalTambah', defText, "#modalTambah .modal-content", function(){
            document.querySelector('#modalTambah form').id = 'formTambah';
            document.querySelector("#modalTambah .modal-header .close").onclick = function(){closeModal('modalTambah')}
            document.querySelector("#modalTambah .modal-footer input").onclick = function(){closeModal('modalTambah')}
            document.querySelector('#modalTambah .modal-header .title').innerHTML = "Tambah Barang"
            var formBarang = document.getElementById('formTambah');
            formBarang.elements.namedItem('jenis').children[0].id = "defaultJenisTambah";
            formBarang.elements.namedItem('jenis').onchange = function(e){
              if(formBarang.elements.namedItem('jenis').children.length == 9){
                removeElements(document.getElementById('defaultJenisTambah'))
              }
            }
            
            formBarang.onsubmit = function(e){
              e.preventDefault();
              formBarang['jumlah'].value = numbered(formBarang['jumlah'].value)
              formBarang['berat'].value = numbered(formBarang['berat'].value)
              formBarang['harga'].value = numbered(formBarang['harga'].value)
              var formData = new FormData(formBarang);
              sendAjax("POST", "/tambahBarang", false, [['accept', 'json']], formData, function(data){
                closeModal("modalTambah");
                getData();
              });
            }
          })
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