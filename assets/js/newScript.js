$(document).ready(function() {
    AOS.init();
    ajaxCallBack("nav", function(result){
      printHeader(result);
      if(window.location.pathname == "/22rental" || window.location.pathname == "/22rental/index.html"){
        nextParticle = new NextParticle(document.all.particle22);
        nextParticle.width = window.innerWidth - 200;
        nextParticle.height = window.innerHeight - 300;
        window.onresize = function() {
            nextParticle.width = window.innerWidth - 200;
            nextParticle.height = window.innerHeight - 300;
            nextParticle.start();
        };
        const navigation = document.getElementById("headerFirst");
        const navigationPre = "rgba(12, 12, 12,";
        const navigationPost = ")";
        navigation.style.backgroundColor = navigationPre + 0 + navigationPost;
        window.onscroll = () => {
            const scroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (scroll / height) * 100;
            let prec = scrolled / 500 * 10;
            navigation.style.backgroundColor = navigationPre + prec + navigationPost;
        };
      }
      if(window.location.pathname == "/22rental/oprema.html"){
        ajaxCallBack("categories", function(result){
          localStorage.setItem("categories", JSON.stringify(result));
          printMainCategories(result);
        });
      }
    });
});
function printMainCategories(data){
  let html = "";
  let noParent = data.filter(x => x.parent == null);
  for(let d of noParent){
    html += `<div data-id="${d.id}" data-title="${d.name}" class="card">
        <div class="cardImage">
          <img src="assets/data/products/CanonFD50mmf1.4.jpg" alt="${d.name}">
        </div>
        <div class="cardText">
          <h4>${d.name}</h4>
        </div>
      </div>`;
  }
  $("#printCatCards").html(html);
  $(".card").click(function() {
    if($("#categoryContainer").width() == window.innerWidth){
      $("#categoryContainer").css("width", "0%");
      let getOne = JSON.parse(localStorage.getItem("categories"));
      // let getOnePrint = getOne.filter(x => x.id == $(this).data("id"));
      // $("#printCatCards").html(`
      // <div data-id="${getOnePrint[0].id}" data-title="${getOnePrint[0].name}" class="card">
      //   <div class="cardImage">
      //     <img src="assets/data/products/CanonFD50mmf1.4.jpg" alt="${getOnePrint[0].name}">
      //   </div>
      //   <div class="cardText">
      //     <h4>${getOnePrint[0].name}</h4>
      //   </div>
      // </div>`);
      $("#printCatCards").html("");
      let getOneSub = getOne.filter(x => x.parent == $(this).data("id"));
      localStorage.setItem("idSubCat", $(this).data("id"));
      printSubCategories(getOneSub);
    }
  });
  $("#arrowSubBack").on("click", function(){
    if($("#categoryContainer").width() < window.innerWidth){
      $("#categoryContainer").css("width", "100%");
      $("#innerSubCatContainer").css("width", "100%");
      //$("#innerSubCatContainer").addClass("jc-ai");
      $("#printSubCats").html("");
      let toFix = JSON.parse(localStorage.getItem("categories"));
      printMainCategories(toFix);
    }
  });
}
function printSubCategories(data){
  let html = "";
  for(let d of data){
    html += `<div data-id="${d.id}" data-title="${d.name}" class="card">
        <div class="cardImage">
          <img src="assets/data/products/CanonFD50mmf1.4.jpg" alt="${d.name}">
        </div>
        <div class="cardText">
          <h4>${d.name}</h4>
        </div>
      </div>`;
  }
  $("#printSubCats").html(html);
  $(".card").click(function() {
    if(!$("#innerSubCatContainer").hasClass("jc-ai")){
      $("#innerSubCatContainer").addClass("jc-ai");
      $("#subCatContainer").css("width", "0%");
      $("#arrowSubBack").css("display", "none");
      $("#printSubCats").html("");
      const idToPrint = $(this).data("id");
      if (JSON.parse(localStorage.getItem("itemsRental")) !== null) {
        toPrintArray = JSON.parse(localStorage.getItem("itemsRental"));
        printItemsCards(toPrintArray, idToPrint);
      } else {
        ajaxCallBack("equipment", function(result){
          
          localStorage.setItem("itemsRental", JSON.stringify(result));
          printItemsCards(result, idToPrint);
        })
      }
    }
  });
  $("#arrowItemBack").on("click", function(){
    if($("#innerSubCatContainer").hasClass("jc-ai")){
      console.log("uslo");
      $("#innerSubCatContainer").removeClass("jc-ai");
      $("#arrowSubBack").css("display", "block");
      $("#subCatContainer").css("width", "100%");
      $("#printItemCards").html("");
      let toFix = JSON.parse(localStorage.getItem("categories"));
      let thatCat = localStorage.getItem("idSubCat");
      let toFixOne = toFix.filter(x => x.parent == thatCat);
      printSubCategories(toFixOne);
    }
  });
}
function printItemsCards(data, categoryId){
  let filteredData = data.filter(x => x.categoryId == categoryId);
  let html = `<div class="fj-text-center"><h3>Trenutno nema dostupne opreme u ovoj kategoriji.</h3></div>`;
  if(filteredData.length != 0){
    html = "";
    for(let d of filteredData){
      let slika = 'camera.png';
      if(d.image != null){
          arrayPic = d.image.split(" ,");
          slika = arrayPic[0];
      }
      html += `<div data-id="${d.id}" data-title="${d.name}" class="card">
          <div class="cardImage">
            <img src="assets/data/products/${slika}" alt="${d.name}">
          </div>
          <div class="cardText">
            <h4>${d.name}</h4>
          </div>
        </div>`;
    }
  }
  $("#printItemCards").html(html);
}
function printHeader(data){
  // let dodatna = " fj-bg-black";
  // if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
  //   dodatna = "";
  // }
  dodatna = "";
  let html = `
  <header id="headerFirst" class="navBarTrans${dodatna}">
            <div class="innerDiv">
                <div class="logo">
                    <a href="index.html">
                        <h1>22</h1>
                    </a>
                </div>
                <div class="hamburger">
                    <div class="hamburgerLines">
                        <div class="line line1"></div>
                        <div class="line line2"></div>
                        <div class="line line3"></div>
                    </div>
                </div>
            </div>
        </header>
        <div id="menu" class="close">
            <div class="blankSpace"></div>
            <div class="navSpace">
                <div class="centerNav">
                    <ul id="printMenu">
                        ${printNavBar(data)}
                    </ul>
                </div>
            </div>
        </div>`;
  $("#printHeader").html(html);
  $(document).on("click", ".hamburger", function() {
    $("#menu").css("display", "flex");
    $("#menu").removeClass("close").addClass("open");
  });
  $(document).on("click", ".blankSpace", function() {
    $("#menu").removeClass("open").addClass("close");
    $("#menu").on('animationend', function() {
      if($("#menu").hasClass("close")){
          $(this).css("display", "none");
      }
    });
  });
}
function printNavBar(data){
  let html = '';
  for(d of data){
    html += `<li><a href="${d.href}">${d.name}</a></li>`;
  }
  return html;
}
function ajaxCallBack(u, s){
  $.ajax({
    url: `assets/data/${u}.json`,
    method: "GET",
    data: "",
    dataType: "json",
    success: s,
    error: function(xhr){
      console.error(xhr);
    }
  });
}
    