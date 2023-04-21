window.onload = function(){
    console.log(window.location.pathname);
    AOS.init();
    printFooter();
    ajaxCallBack("assets/data/nav.json", "get", "", function(result){
        let html = "";
        let html2 = "";
        for(let i of result){
            html += `<li class="nav-item">
            <a class="nav-link" href="${i.href}">${i.name}</a>
            </li>`;
            html2 += `<li>
            <a class="text-white" href="${i.href}">${i.name}</a>
            </li>`;
        }
        html += `<li class="nav-item my-1 d-flex justify-content-center">
        <i id="searchSee" class="nav-link fa-solid fa-magnifying-glass"></i>
        <div id="dropdown">
            <input type="text" id="searchDo" placeholder="Pretražite opremu"/>
            <div id="dropdownContent">
                
            </div>
        </div>
      </li>`;
        $("#navPrint").html(html);
        $("#printNavFooter").html(html2);
        $("#searchSee").on("click", function(){
            $("#dropdown").animate({width: "toggle"})
        });
        $("#searchDo").on("keyup", function(){
            if($("#searchDo").val() != ""){
                $("#dropdownContent").show();
                ajaxCallBack("assets/data/equipment.json", "get", "", function(result){
                    let searchParam = $("#searchDo").val();
                    result = result.filter((x) => {
                        if(x.name.toLowerCase().indexOf(searchParam.trim().toLowerCase()) != -1) {
                            return x;
                        }
                    });
                    let html = "";
                    let lengthResult = result.length;
                    if(result.length > 3){
                        lengthResult = 3;
                    }
                    for(let i = 0; i < lengthResult; i++){
                        let slika = 'camera.png';
                        if(result[i].image != null){
                            arrayPic = result[i].image.split(" ,");
                            slika = arrayPic[0];
                        }
                        html += `<a href="items.html?category=${result[i].categoryId}&item=${result[i].id}">
                        <div class="dropItem">
                            <div class="dropImage">
                                <img src="assets/data/products/${slika}" alt="camera" />
                            </div>
                            <div class="dropText">
                                <div class="dropTextCenter"><p>${result[i].name}</p></div>
                                
                            </div>
                        </div>
                        </a>`;
                    }
                    if(result.length > 3){
                        html += `
                        <a href="search.html?searchParam=${searchParam}">
                            <div class="dropItem text-center p-0">
                                <p>Još rezultata</p>
                            </div>
                        </a>`
                    }
                    $("#dropdownContent").html(html);
                });
            }
            else{
                $("#dropdownContent").hide();
            }
        });
        $(document).on("click", function(){
            $("#dropdownContent").hide();
        });
    });
    if (window.location.pathname == "/22rental" || window.location.pathname == "/22rental/index.html"){
        //progressBar
        const progressBar = document.getElementById("progressbar");
        const navigation = document.getElementById("navBarTrans");
        const navigationPre = "rgba(21, 37, 54,";
        const navigationPost = ")";
        progressBar.style.height = 1 + "%";
        navigation.style.backgroundColor = navigationPre + 0 + navigationPost;
        window.onscroll = () => {
            const scroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (scroll / height) * 100;
            let prec = scrolled / 500 * 10;
            if (scrolled <= 1) {
                progressBar.style.height = 1 + "%";
            } else if (scrolled >= 2 && scrolled <= 99.9) {
                progressBar.style.height = scrolled + "%";
            } else if (scrolled === 100) {
                progressBar.style.height = scrolled + "%";
            }

            navigation.style.backgroundColor = navigationPre + prec + navigationPost;
        };
        ajaxCallBack("assets/data/equipment.json", "get", "", function(result){
            let html = "";
            for(let i = result.length - 1; i > result.length - 4; i--){
                let slika = 'camera.png';
                if(result[i].image != null){
                    arrayPic = result[i].image.split(" ,");
                    slika = arrayPic[0];
                }
                html += `<div class="col-12 col-sm-6 col-lg-3 catItem mb-3" data-id="${i.id}">
                <a href="items.html?category=${result[i].categoryId}&item=${result[i].id}&cat">
                <div class="card">
                  <img src="assets/data/products/${slika}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title text-center">${result[i].name}</h5>
                  </div>
                </div>
                </a>
              </div>`;
            }
            $("#printNew").html(html);
        });
    }
    if (window.location.pathname == "/22rental/categories.html"){
        ajaxCallBack("assets/data/categories.json", "get", "", function(result){
            console.log(result);
            let html = "";
            for(let i of result){
                if(i.parent == null){
                    html += `
                
                    <div class="col-12 col-sm-6 col-lg-4 catItem">
                <a href="subcategories.html?category=${i.id}">
                <div class="card">
                  <img src="assets/data/products/camera.png" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title text-center">${i.name}</h5>
                  </div>
                </div>
              </a>
              </div>
                    `;
                }
            }
            $("#printCategories").html(html);
        });
        
    }
    if (window.location.pathname == "/22rental/items.html"){
        ajaxCallBack("assets/data/categories.json", "get", "", function(result){
            let urlParams = new URLSearchParams(window.location.search);
            let myParam = urlParams.get('category');
            if(myParam == null){
                myParam = '3';
            }
            localStorage.setItem("selectedCategory", myParam);
            printItemData();
        });
    }
    if (window.location.pathname == "/22rental/subcategories.html"){
        ajaxCallBack("assets/data/categories.json", "get", "", function(result){
            let urlParams = new URLSearchParams(window.location.search);
            let myParam = urlParams.get('category');
            if(myParam == null){
                myParam = '1';
            }
            let newArray = result.filter(x => x.id == myParam || x.parent == myParam);
            let html = '';
            for(let i of newArray){
                if(i.id == myParam){
                    continue;
                }
                html += `<div class="col-12 col-sm-6 col-lg-3 catItem pb-3" data-id="${i.id}">
                <a href="items.html?category=${i.id}">
                <div class="card">
                  <img src="assets/data/products/camera.png" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title text-center">${i.name}</h5>
                  </div>
                </div>
                </a>
              </div>`;
            }
            $('#getTitle').html(newArray[0].name);
            $('#printSubCats').html(html);
        });
    }
    if (window.location.pathname == "/22rental/search.html"){
        let urlParams = new URLSearchParams(window.location.search);
        let myParam = urlParams.get('searchParam');
        $('#searchTitle').html(`<h1>Oprema pretrazena sa "${myParam}"</h1>`);
        ajaxCallBack("assets/data/equipment.json", "get", "", function(result){
            let searchParam = $("#searchDo").val();
            result = result.filter((x) => {
                if(x.name.toLowerCase().indexOf(searchParam.trim().toLowerCase()) != -1) {
                    return x;
                }
            });
            let html = "";
            for(let i = 0; i < result.length; i++){
                let slika = 'camera.png';
                if(result[i].image != null){
                    arrayPic = result[i].image.split(" ,");
                    slika = arrayPic[0];
                }
                html += `
                <div class="col-12 col-sm-6 col-lg-3 catItem mb-3" data-id="${i.id}">
                <a href="items.html?category=${result[i].categoryId}&item=${result[i].id}&cat">
                <div class="card">
                  <img src="assets/data/products/${slika}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title text-center">${result[i].name}</h5>
                  </div>
                </div>
                </a>
              </div>`;
            }
            $("#printItemsSearch").html(html);
        });
    }
}

function printItemData(){
    ajaxCallBack("assets/data/equipment.json", "get", "", function(result){
        let myParam = localStorage.getItem("selectedCategory");
        let newArray = result.filter(x => x.categoryId == myParam);
        let html = `<div class="col-12 text-center"><h3>Trenutno nema dostupne opreme u ovoj kategoriji</h3></div>`;
        if(newArray.length != 0){
            localStorage.setItem('items', JSON.stringify(newArray));
            html = '';
            for(let i of newArray){
                let slika = 'camera.png';
                if(i.image != null){
                    arrayPic = i.image.split(" ,");
                    slika = arrayPic[0];
                }
                html += `<div class="col-12 col-sm-6 col-lg-3 catItem mb-3" data-id="${i.id}">
                <div class="card">
                  <img src="assets/data/products/${slika}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title text-center">${i.name}</h5>
                  </div>
                </div>
              </div>`;
            }
        }
        $('#printItems').html(html);
        $(".catItem").click(function(){
            let checkId = $(this).data("id");
            let checkArray = JSON.parse(localStorage.getItem("items"));
            let printItem = checkArray.filter(x => x.id == checkId);
            console.log();
            itemPrint(printItem[0]);
            $("#itemShow").animate({
                height: 'toggle'
            });
            $("#itemShow").css('display', 'flex');
        })
        let urlParams = new URLSearchParams(window.location.search);
        let myItem = urlParams.get('item');
        if(myItem){
            let checkArray = JSON.parse(localStorage.getItem("items"));
            let printItem = checkArray.filter(x => x.id == myItem);
            itemPrint(printItem[0]);
            $("#itemShow").animate({
                height: 'toggle'
            });
            $("#itemShow").css('display', 'flex');
        }
    });
    $("#closeBg").click(function(){
        $("#filterShow").fadeToggle();
    });
    $("#filterBtn").click(function(){
        $("#filterShow").fadeToggle().css("display", "flex");
    });
}

function itemPrint(data){
    html = `<div id="iksic">X</div>
    <div class="row toCenter">
      <div class="col-12 col-lg-6">
        <div class="prodImg">
            ${printImageItem(data.image)}
        </div>
      </div>
      <div class="col-12 col-lg-6 p-5">
        <h2>${data.name}</h2>
        <h5>${data.price} € / dan</h5>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, tenetur aspernatur? Nisi officiis autem tempora doloremque, minus odit assumenda consequatur quidem laborum, error, minima veritatis provident ex et reprehenderit. Minima.</p>
      </div>
    </div>`;
    $("#itemShow").html(html);
        // $('.zoom').magnify({
            
        //   });
        $('.zoom').zoom({magnify: 1.3});
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.slider-nav',
        draggable: false
      });
      $('.slider-nav').slick({
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        centerMode: true,
        focusOnSelect: true,
        arrows: false
      });
    $("#iksic").click(function(){
        $("#itemShow").animate({
            height: 'toggle'
          });
    });
}
function printImageItem(arrayPic){
    let html = "";
    if(arrayPic == null){
        html = `<span class="zoom"><img class="imgItem" src="assets/data/products/camera.png" alt="image" data-magnify-src="camera.png"></span>`;
        return html;
    }
    arrayPic = arrayPic.split(" ,");
    html = `<span class="zoom"><img class="imgItem" src="assets/data/products/${arrayPic[0]}" alt="image" data-magnify-src="${arrayPic[0]}"></span>`;
    if(arrayPic.length != 1){
        let temp = "";
        html = `<div class="slider slider-for">`;
        for(let a of arrayPic){
            temp += `
            <div class="zoom"><img class="imgItem" src="assets/data/products/${a}" alt="" data-magnify-src="${a}"></div>
            `;
        }
        html += temp;
        html += `</div>
        <div class="slider slider-nav">`;
        temp = "";
        for(let a of arrayPic){
            temp += `
            <div><img src="assets/data/products/${a}" alt=""></div>
            `;
        }
        html += temp;
        html += '</div>';
    }
    return html;
}
function printFooter(){
    let html = `
    <div class="row py-3 fj-footer d-flex justify-content-around">
      <div class="col-12 col-lg-4 fj-footer-div">
        <ul>
          <li><i class="fa-brands fa-instagram"></i> Lorem ipsum</li>
          <li><i class="fa-brands fa-facebook"></i> Lorem ipsum</li>
          <li><i class="fa-brands fa-twitter"></i> Lorem ipsum</li>
        </ul>
      </div>
      <div class="col-12 col-lg-4 fj-footer-div">
        <ul>
          <li>Broj telefona, email...</li>
          <li>Lorem ipsum</li>
          <li>Lorem ipsum</li>
        </ul>
      </div>
      <div class="col-12 col-lg-4 fj-footer-div">
        <ul id="printNavFooter">

        </ul>
      </div>
    </div>
    <div class="col-12 text-center">
        <p>Designed by <a href="https://jelkesudo.github.io/portfolio/" target="_blank">Filip Jelic</a> 2023</p>
    </div>
    `;
    $("#footerPrint").html(html);
}
function ajaxCallBack(u, m, d, s){
    $.ajax({
        url: u,
        method: m,
        dataType: "json",
        data: d,
        success: s,
        error: function(xhr){
            console.error(xhr);
        }
    });
}

