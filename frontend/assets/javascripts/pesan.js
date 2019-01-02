var idBrg = localStorage.getItem("id_brg");
var jumlahBrg = localStorage.getItem("jumlah_brg");

var pesanContent =
    '<legend>Form Pengiriman dan Pembayaran</legend>' +
    '<form id="send-info" class="form-pengiriman" method="post">' +
    '<div>' +
        '<input  type="text" name="name" autocomplete="name" placeholder="*Nama">' +
        '<input  type="text" name="organization" autocomplete="organization" placeholder="Nama Perusahaan/Instansi">' +
        '</div>' +
        '<div>' +
        '<input  type="text" name="phone" autocomplete="tel-national" placeholder="*Nomor Telepon/Telepon Genggam">' +
        '<input  type="email" name="email" autocomplete="email" placeholder="*E-mail">' +
        '</div>' +
        '<div>' +
        '<input  type="text" name="province" autocomplete="off" placeholder="*Nama Provinsi" list="province-name">' +
        '<datalist id="province-name">' +
        '</datalist>' +
        '<input  type="text" name="city" autocomplete="off" placeholder="*Nama Kota" list="city-name">' +
        '<datalist id="city-name">' +
        '</datalist>' +
        '</div>' +
        '<div>' +
        '<input  type="text" name="subdistrict" autocomplete="address-level3" placeholder="*Nama Kecamatan">' +
        '<input  type="text" name="village" autocomplete="address-level4" placeholder="*Nama Kelurahan/Desa" >' +
        '</div>' +
        '<div>' +
        '<input  type="text" name="postcode" autocomplete="postal-code" placeholder="*Nomor Pos">' +
        '<input  type="text" name="address" autocomplete="address-line1" placeholder="*Alamat">' +
        '</div>'+
        '<div>' +
        '<select  name="courier"><option>*Kurir Pengiriman</option><option>JNE</option><option>TIKI</option><option>POS</option></select>' +
        '<select  name="packet"><option>*Paket Pengiriman</option></select>' +
        '</div>'+
        '<div>' +
        '<textarea name="description" placeholder="Deskrisi Barang dan Pemesanan"></textarea>' +
        '</div>' +
        '<div class="tbl-cont">' +
        '<table class="tbl-brg">' +
        '<thead>'+
        '<tr><th>Produk</th><th>Nama Produk</th><th>Jumlah</th><th>Harga</th></tr>'+
        '</thead>' +
        '<tbody>' +
        '<tr><td class="border-none"></td><td class="border-none"></td><td>Subtotal</td><td id="sub-total"></td></tr>' +
        '<tr><td class="border-none"></td><td class="border-none"></td><td>Biaya Pengiriman</td><td id="ongkos-kirim">-</td></tr>' +
        '<tr><td class="border-none"></td><td class="border-none"></td><td>Total</td><td id="total"></td></tr>' +
        '<tbody/>' +
        '</table>' +
    '</div>' +
    '<button type="submit">Submit</button>' +
    '</form>';

var bayarContent =
    '<legend>Form Pelampiran Pembayaran</legend>' +
    '<form name="form-nomor" method="post" ><br>' +
        '<div>Anda telah melakukan Pemesanan, silahkan lakukan pembayaran ke akun rekening kami. Apabila sudah, lampirkan bukti pembayaran pada halaman ini dengan melampirkan nomor telepon/handphone yang anda gunakan ketika pemesanan dan foto atau hasil scan bukti pembayaran</div>' +
        '<input type="text" id="phone" name="phone" placeholder="Nomor Telepon">' +
        // '<input type="file" id="file" name="payed" placeholder="">' +
        '<button type="submit" name="submit">Submit</button' +
    '</form>';

var inputObj = {};

function getData(){
    var pesan = /(\/pesan)(\/)?/;
    var bayar = /(\/bayar)(\/)?/;
    var container = document.getElementsByClassName('container')[0]
    container.innerHTML = "";

    if(pesan.test(window.location.pathname)){
        if(((jumlahBrg === "") && (idBrg === "")) || ((jumlahBrg === null) && (idBrg === null))){
            alert("Anda Belum Memesan Barang");
            window.history.back();
        }else{
        var totBrg = [];
        var idBrgArr = idBrg.split(",");
        var jumBrgArr = jumlahBrg.split(",");
        for(var i = 0; i < idBrgArr.length; i++){
            totBrg.push([idBrgArr[i], jumBrgArr[i]]);
        }
        var field = document.createElement("FIELDSET");
        field.className ="field-cat";
        field.innerHTML = pesanContent;
        container.appendChild(field);
        // tableFixer(document.getElementsByClassName("tbl-brg")[0], document.getElementsByClassName("tbl-cont")[0]);
        sendAjax("POST", "/pesan", false, [['accept', 'json']], JSON.stringify(totBrg) , function(result){
            result = JSON.parse(result);
            var tbody = document.getElementsByClassName("tbl-brg")[0].children[1];
            for(var i = 0; i < result.length; i++){
                var tr = document.createElement("TR");
                var text =
                    '<td><div class="img-produk" style="background-image:url(assets/images/barang/'+result[i].gambar_brg+')"></div> </td>' +
                    '<td>'+result[i].nama_brg+'</td>' +
                    '<td>'+result[i].jumlah_beli+'</td>' +
                    '<td>'+numberToRupiah(result[i].harga_brg)+'</td>';
                tr.innerHTML = text;
                tbody.insertBefore(tr , tbody.children[0]);
            }
            var subTotal = 0;
            for(var i = 0; i < tbody.children.length - 3; i++){
                var jumlah = parseInt(tbody.children[i].children[2].textContent);
                var harga = rupiahToNumber(tbody.children[i].children[3].textContent);
                subTotal+= (jumlah * harga);
            }
            totBrg = totBrg.join(";")
            var inputTotBrg = document.createElement("INPUT") ;
            inputTotBrg.type = "hidden";
            inputTotBrg.name = "totbrg";
            inputTotBrg.value = totBrg;
            tbody.appendChild(inputTotBrg);
            var subTot = document.getElementById('sub-total').innerHTML = numberToRupiah(subTotal);
            document.getElementById('total').innerHTML = subTot;

            var provinceList = document.getElementById('province-name');
            var cityList = document.getElementById('city-name');

            var province = document.getElementsByName('province')[0];
            var city = document.getElementsByName('city')[0];
            var kurir = document.getElementsByName('courier')[0];
            var paket = document.getElementsByName('packet')[0];
            kurir.onchange = function(e){
                if(kurir.children.length == 4){
                    removeElements(kurir.children[0]);
                }
            }
            function resetValIn(arrEl, arrVal){
                for(var j = 0; j < arrEl.length; j++){
                    document.getElementsByName(arrEl[j])[0].innerHTML = arrVal[j];
                    document.getElementById('ongkos-kirim').innerHTML = "-";
                    document.getElementById('total').innerHTML = subTot;
                }
            }
            function disIn(arrEl, arrVal){
                for(var j = 0; j < arrEl.length; j++){
                    document.getElementsByName(arrEl[j])[0].disabled = arrVal[j];
                }
            }
            disIn(['province', 'city', 'courier', 'packet'], [true, true, true, true]);
            sendAjax("GET", "/pesan/province", false, [['accept','json']], undefined, function(result){
                result = JSON.parse(result);
                var pVal = [];
                var pId = [];
                for(var i = 0; i < result.length; i++){
                    var opEl = document.createElement("option");
                    pVal.push(result[i].province);
                    opEl.value = result[i].province;
                    pId.push(result[i].province_id);
                    provinceList.appendChild(opEl);
                }
                disIn(['province', 'city', 'courier', 'packet'], [false, true, true, true]);

                province.onchange = function(e){
                    resetValIn(['city', 'courier', 'packet'], ['', '<option>*Kurir Pengiriman</option><option>JNE</option><option>TIKI</option><option>POS</option>', '<option>*Paket Pengiriman</option>']);
                    if(pVal.indexOf(province.value) >= 0){
                        city.value = "";
                        cityList.innerHTML = "";
                        var newPId = pId[pVal.indexOf(province.value)];
                        if(newPId){
                            sendAjax("GET", "/pesan/city/" + newPId, false, [['accept','json']], undefined, function(result1){
                                result1 = JSON.parse(result1);
                                var cVal = [];
                                var cId = [];
                                for(var i = 0; i < result1.length; i++){
                                    var opEl = document.createElement("option");
                                    cVal.push(result1[i].city_name);
                                    cId.push(result1[i].city_id);
                                    opEl.value = result1[i].city_name;
                                    cityList.appendChild(opEl);    
                                }
                                disIn(['province', 'city', 'courier', 'packet'], [false, false, true, true]);

                                city.onchange = function(e){
                                    document.getElementsByName('postcode')[0].value = result1[cVal.indexOf(city.value)].postal_code;
                                    disIn(['province', 'city', 'courier', 'packet'], [false, false, false, true]);
                                    resetValIn(['courier', 'packet'], ['<option>*Kurir Pengiriman</option><option>JNE</option><option>TIKI</option><option>POS</option>', '<option>*Paket Pengiriman</option>']);
                                    kurir.onchange = function(e){
                                        disIn(['province', 'city', 'courier', 'packet'], [false, false, false, true]);
                                        resetValIn(['packet'], ['<option>*Paket Pengiriman</option>']);
                                        if(kurir.children.length == 4){
                                            removeElements(kurir.children[0]);
                                        }
                                        var costData = {
                                            id: result1[cVal.indexOf(city.value)].city_id,
                                            kurir: kurir.value,
                                            totBrg: totBrg
                                        }
                                        sendAjax("POST", "/pesan/cost", false, [['accept','json']], JSON.stringify(costData), function(result2){
                                            result2 = JSON.parse(result2)
                                            var costs = result2[0].costs;
                                            for(var j = 0; j < costs.length; j++){
                                                var opEl3 = document.createElement('option');
                                                opEl3.innerHTML = costs[j].service + " (" + costs[j].cost[0].etd + " hari) " + numberToRupiah(costs[j].cost[0].value);
                                                paket.appendChild(opEl3);
                                            }
                                            disIn(['province', 'city', 'courier', 'packet'], [false, false, false, false]);
                                            paket.onchange = function(e){
                                                var biaya = e.target.value.split(")").pop();
                                                var ongkir = document.getElementById('ongkos-kirim').innerHTML = biaya;
                                                document.getElementById('total').innerHTML = numberToRupiah(rupiahToNumber(subTot) + rupiahToNumber(ongkir));
                                            }
                                        })
                                    }
                                }
                            })   
                        }
                    }
                }
            })

            var sendInfo = document.getElementById("send-info");
            sendInfo.onsubmit = function(e){
                e.preventDefault();
                var inputInfo = document.querySelectorAll("input");
                var selectInfo = document.querySelectorAll("select");
                var inputValue = [];
                for(var i = 0; i < inputInfo.length; i++){
                    if(inputInfo[i].name == "organization"){
                        (inputInfo[i].value !== "")?inputInfo[i].value : inputInfo[i].value = "-";
                    }
                        inputValue.push(inputInfo[i].value);
                        inputObj[inputInfo[i].name] = inputInfo[i].value;
                }
                
                var selTest = /[*]/gi;
                for(var i = 0; i < selectInfo.length; i++){
                    if(!selTest.test(selectInfo[i].value)){
                        var xVal
                        if(selectInfo[i].value.indexOf("(") >= 0){
                            xVal = selectInfo[i].value.split("(").shift();
                        }else{
                            xVal = selectInfo[i].value;
                        }
                        inputValue.push(xVal);
                        inputObj[selectInfo[i].name] = xVal;
                    }else{
                        inputValue.push("");
                    }
                }

                var description = document.getElementsByTagName('textarea').description;
                inputObj[description.name] = description.value;

                if(inputValue.indexOf("") >=0 || inputValue.indexOf(" ") >= 0){
                    alert("Masih terdapat Data yang kosong");
                }else{
                    sendAjax("POST", "/postPesan", false, [['accept', 'json']], JSON.stringify(inputObj), function(response){
                      if(response == "false"){
                        alert('anda tidak dapat memesan dua kali berturut-turut, harap membayar terlebih dahulu pesanan anda sebelumnya');
                        history.replaceState("", "", "/bayar"); getData();
                      }else if(response == "true"){
                        alert('Terima Kasih telah Membeli barang kami');
                        localStorage.removeItem("cart");
                        sendInfo.onsubmit = function(e){e.preventDefault()}
                        localStorage.removeItem("id_brg");
                        localStorage.removeItem("jumlah_brg");
                        localStorage.removeItem("lastCount");
                        localStorage.removeItem("total");
                        history.replaceState("", "", "/bayar"); getData();
                      }
                    });
                }
            }
        });
      }
    }else if(bayar.test(window.location.pathname)){
        var showBayar = function(data){
            var field = document.createElement("FIELDSET");
            field.className ="field-cat";
            field.innerHTML = bayarContent;
            container.appendChild(field);
            var noPesan = document.getElementById('phone');
            if(getCookie("noPesan") !== ""){
                noPesan.value = getCookie("noPesan");
            }
            var formNomor = document.forms['form-nomor'];
            formNomor.onsubmit = function(e){
                var nomorHp = formNomor.elements.namedItem('phone').value;
                e.preventDefault();
                sendAjax("POST", "/getBayar", false, [['accept', 'json']], String(nomorHp), function(data){
                    data = JSON.parse(data)
                    console.log(data)
                    if(data){
                    var newText = 
                    '<legend>Form Pelampiran Pembayaran</legend>' +
                    '<br/><div class="tbl-cont" style="text-align:left;padding-left:20px">' +
                    'Nama : '+ data.nama_pemesan +'<br/>' +
                    'Instansi : '+ data.nama_instansi +'<br/>' +
                    'Nomor HP : '+ data.nomor_hp +'<br/>' +
                    'Email : '+ data.email +'<br/>' +
                    'Pengiriman : '+ data.kurir.split(";").shift() +' dengan paket '+ data.kurir.split(";").pop() +' ('+ data.ongkir.split(";").pop() +' hari)<br/>' +
                    '</div>' +
                    '<div class="tbl-cont">' +
                        '<table class="tbl-brg">' +
                        '<thead>'+
                        '<tr><th>Produk</th><th>Nama Produk</th><th>Jumlah</th><th>Harga</th></tr>'+
                        '</thead>' +
                        '<tbody>' +
                        '<tr><td class="border-none"></td><td class="border-none"></td><td>Subtotal</td><td id="sub-total"></td></tr>' +
                        '<tr><td class="border-none"></td><td class="border-none"></td><td>Biaya Pengiriman</td><td id="ongkos-kirim">'+ numberToRupiah(data.ongkir.split(";").shift()) +'</td></tr>' +
                        '<tr><td class="border-none"></td><td class="border-none"></td><td>Total</td><td id="total"></td></tr>' +
                        '<tbody/>' +
                        '</table>' +
                    '</div>' +
                    '<form name="form-bayar" method="post" enctype="multipart/form-data"><br>' +
                        '<div>Lampirkan Bukti Pembayaran pada form berikut</div>' +
                        '<input type="hidden" id="phone" name="phone" value="'+ nomorHp +'">' +
                        '<input type="file" id="file" name="payed">' +
                        '<button type="submit" name="submit">Submit</button' +
                    '</form>';
                    document.getElementsByClassName('field-cat')[0].innerHTML = newText;
                    var brgByr = data.pcs.split(";");
                    brgByr.pop()
                    var tbody = document.getElementsByClassName("tbl-brg")[0].children[1];
                    for(var i = 0; i < brgByr.length; i++){
                        var tr = document.createElement('tr');
                        brgByr[i] = brgByr[i].split(",");
                        var text = 
                        '<td><div class="img-produk" style="background-image:url(assets/images/barang/'+brgByr[i][4]+')"></div> </td>' +
                        '<td>'+brgByr[i][3]+'</td>' +
                        '<td>'+brgByr[i][1]+'</td>' +
                        '<td>'+numberToRupiah(brgByr[i][2])+'</td>';
                        tr.innerHTML = text;
                        tbody.insertBefore(tr , tbody.children[0]);
                    }
                    var subTotal = 0;
                    for(var i = 0; i < tbody.children.length - 3; i++){
                        var jumlah = parseInt(tbody.children[i].children[2].textContent);
                        var harga = rupiahToNumber(tbody.children[i].children[3].textContent);
                        subTotal+= (jumlah * harga);
                    }
                    var subTot = document.getElementById('sub-total').innerHTML = numberToRupiah(subTotal);
                    var ongkir = document.getElementById('ongkos-kirim').innerHTML;
                    document.getElementById('total').innerHTML = numberToRupiah(rupiahToNumber(subTot) + rupiahToNumber(ongkir));
                    var formBayar = document.forms["form-bayar"];

                    formBayar.onsubmit = function(e){
                        e.preventDefault();
                        var formdata = new FormData(formBayar);
                        sendAjax("POST", "/bayar", false, [['accept', 'json']], formdata, function(data){
                            document.write(data);
                        });
                    }
                    }else{
                        var newText = 
                        '<legend>Form Pelampiran Pembayaran</legend>' +
                        '<br><div>Maaf, tidak terdaftar pesanan dengan nomor tersebut</div><br>';
                        document.getElementsByClassName('field-cat')[0].innerHTML = newText;
                    }
                })
            }
            
        }
            showBayar();
    }
}

getData();
