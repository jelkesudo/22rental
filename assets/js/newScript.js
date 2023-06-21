$(document).ready(function() {
    AOS.init();
    ajaxCallBack("nav", function(result){
      printHeader(result);
      if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
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
      if(window.location.pathname == "/oprema.html"){
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
      $("#categoryContainer").css("width", "30%");
      $("#innerSubCatContainer").addClass("cursor-poiner");
      let getOne = JSON.parse(localStorage.getItem("categories"));
      let getOnePrint = getOne.filter(x => x.id == $(this).data("id"));
      $("#printCatCards").html(`
      <div data-id="${getOnePrint[0].id}" data-title="${getOnePrint[0].name}" class="card">
        <div class="cardImage">
          <img src="assets/data/products/CanonFD50mmf1.4.jpg" alt="${getOnePrint[0].name}">
        </div>
        <div class="cardText">
          <h4>${getOnePrint[0].name}</h4>
        </div>
      </div>`);
      let getOneSub = getOne.filter(x => x.parent == $(this).data("id"));
      localStorage.setItem("idSubCat", $(this).data("id"));
      printSubCategories(getOneSub);
    }
  });
  $("#categoryContainer").on("click", function(){
    if($("#categoryContainer").width() < window.innerWidth){
      $("#categoryContainer").css("width", "100%");
      $("#innerSubCatContainer").css("height", "100vh");
      $("#innerSubCatContainer").removeClass("cursor-poiner");
      $("#innerSubCatContainer").addClass("jc-ai");
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
    if($("#innerSubCatContainer").height() == window.innerHeight){
      $("#innerSubCatContainer").removeClass("jc-ai");
      $("#innerSubCatContainer").addClass("cursor-poiner");
      $("#innerSubCatContainer").css("height", "10vh");
      html = `<div><h3>${$(this).data("title")}</h3></div>`;
      $("#printSubCats").html(html);
    }
  });
  $("#innerSubCatContainer").on("click", function(){
    if($("#innerSubCatContainer").height() < window.innerHeight){
      $("#innerSubCatContainer").addClass("jc-ai");
      $("#innerSubCatContainer").removeClass("cursor-poiner");
      $("#innerSubCatContainer").css("height", "100vh");
      let toFix = JSON.parse(localStorage.getItem("categories"));
      let thatCat = localStorage.getItem("idSubCat");
      let toFixOne = toFix.filter(x => x.parent == thatCat);
      printSubCategories(toFixOne);
    }
  });
}
function printHeader(data){
  let dodatna = " fj-bg-black";
  if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
    dodatna = "";
  }
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
    