(function(){
"use strict";
var PRODUCTS=[
{id:1,name:"Darjeeling First Flush",type:"Black",origin:"Darjeeling, India",price:649,c:"#c98b3c",note:"Muscatel, floral, light body"},
{id:2,name:"Assam Breakfast",type:"Black",origin:"Assam, India",price:449,c:"#8a3b22",note:"Malty, bold, takes milk well"},
{id:3,name:"Nilgiri Frost Green",type:"Green",origin:"Nilgiris, India",price:549,c:"#5f9a52",note:"Grassy, sweet, clean finish"},
{id:4,name:"Ceremonial Matcha",type:"Green",origin:"Uji, Japan",price:1499,c:"#3d7a3a",note:"Vivid, creamy, umami-rich"},
{id:5,name:"Jasmine Pearls",type:"Green",origin:"Fujian, China",price:899,c:"#a7c78b",note:"Hand-rolled, perfumed, soft"},
{id:6,name:"Masala Chai Blend",type:"Spiced",origin:"Kerala, India",price:399,c:"#b5652b",note:"Cardamom, ginger, clove"},
{id:7,name:"Chamomile & Honey",type:"Herbal",origin:"Egypt",price:349,c:"#e3c34f",note:"Caffeine-free, calming"},
{id:8,name:"Tulsi Ginger",type:"Herbal",origin:"Uttarakhand, India",price:379,c:"#6e8f3e",note:"Caffeine-free, warming"},
{id:9,name:"Oolong Milk",type:"Oolong",origin:"Taiwan",price:1099,c:"#a9905a",note:"Buttery, smooth, round"}
];
var $=function(s){return document.querySelector(s)};
var state={q:"",type:"All",sort:"feat",cart:{}};
var lastFocus=null;

/* Safe storage */
function load(){try{var s=localStorage.getItem("sw-cart");if(s)state.cart=JSON.parse(s)||{}}catch(e){}
 try{var t=localStorage.getItem("sw-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}}
function save(){try{localStorage.setItem("sw-cart",JSON.stringify(state.cart))}catch(e){}}
function money(n){return "₹"+n.toLocaleString("en-IN")}
function byId(id){for(var i=0;i<PRODUCTS.length;i++)if(PRODUCTS[i].id===id)return PRODUCTS[i]}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

/* Product art rendered lazily as inline SVG (no image requests) */
function tin(p){return '<svg viewBox="0 0 200 200" width="70%" role="img" aria-label="'+esc(p.name)+' tin"><rect x="45" y="30" width="110" height="145" rx="14" fill="'+p.c+'"/><rect x="45" y="30" width="110" height="26" rx="10" fill="#17261f" opacity=".35"/><rect x="62" y="80" width="76" height="52" rx="6" fill="#f8faf6"/><text x="100" y="112" text-anchor="middle" font-size="22" font-weight="800" fill="#17261f" font-family="sans-serif">'+esc(p.type)+'</text></svg>'}
var io=null;
function lazy(){
 var els=document.querySelectorAll(".art.sk");
 function fill(el){var p=byId(+el.getAttribute("data-id"));el.innerHTML=tin(p);el.className="art"}
 if(!("IntersectionObserver" in window)){for(var i=0;i<els.length;i++)fill(els[i]);return}
 if(io)io.disconnect();
 io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){fill(e.target);io.unobserve(e.target)}})},{rootMargin:"200px"});
 for(var j=0;j<els.length;j++)io.observe(els[j]);
}

function visible(){
 var q=state.q.trim().toLowerCase();
 var list=PRODUCTS.filter(function(p){
  return (state.type==="All"||p.type===state.type)&&(!q||(p.name+" "+p.type+" "+p.origin+" "+p.note).toLowerCase().indexOf(q)>-1)});
 if(state.sort==="lo")list.sort(function(a,b){return a.price-b.price});
 if(state.sort==="hi")list.sort(function(a,b){return b.price-a.price});
 if(state.sort==="az")list.sort(function(a,b){return a.name.localeCompare(b.name)});
 return list;
}
function renderGrid(){
 var list=visible();
 $("#grid").innerHTML=list.length?list.map(function(p){
  return '<article class="card"><div class="art sk" data-id="'+p.id+'"></div><div class="body"><h3>'+esc(p.name)+'</h3><p class="meta">'+esc(p.origin)+'</p><p class="meta">'+esc(p.note)+'</p><div class="row"><span class="price">'+money(p.price)+'</span><button class="btn" type="button" data-add="'+p.id+'" aria-label="Add '+esc(p.name)+' to cart">Add</button></div></div></article>'}).join(""):
  '<p class="empty">No teas match "'+esc(state.q)+'". Try a different search or clear the filter.</p>';
 lazy();
}
function renderChips(){
 var types=["All"];PRODUCTS.forEach(function(p){if(types.indexOf(p.type)<0)types.push(p.type)});
 $("#chips").innerHTML=types.map(function(t){return '<button type="button" class="chip" data-type="'+t+'" aria-pressed="'+(t===state.type)+'">'+t+'</button>'}).join("");
}
function totals(){var n=0,s=0;Object.keys(state.cart).forEach(function(id){var p=byId(+id);if(p){n+=state.cart[id];s+=p.price*state.cart[id]}});return {n:n,s:s}}
function renderCart(){
 var t=totals(),ids=Object.keys(state.cart);
 $("#count").textContent=t.n;$("#sub").textContent=money(t.s);$("#checkout").disabled=!t.n;
 $("#items").innerHTML=ids.length?ids.map(function(id){var p=byId(+id),q=state.cart[id];
  return '<li class="item"><strong>'+esc(p.name)+'</strong><span>'+money(p.price*q)+'</span><div class="qty"><button type="button" data-dec="'+id+'" aria-label="Decrease quantity">−</button><span aria-live="polite">'+q+'</span><button type="button" data-inc="'+id+'" aria-label="Increase quantity">+</button></div><button class="link" type="button" data-rm="'+id+'">Remove</button></li>'}).join(""):
  '<li class="empty">Your cart is empty. Add a tea to get started.</li>';
}
function toast(m){var t=$("#toast");t.textContent=m;t.className="toast on";clearTimeout(toast.h);toast.h=setTimeout(function(){t.className="toast"},1800)}
function change(id,d){var q=(state.cart[id]||0)+d;if(q<=0)delete state.cart[id];else state.cart[id]=Math.min(q,20);save();renderCart()}

/* Drawer */
function openCart(){lastFocus=document.activeElement;$("#ov").classList.add("on");$("#drawer").classList.add("on");$("#closeCart").focus()}
function closeCart(){$("#ov").classList.remove("on");$("#drawer").classList.remove("on");if(lastFocus)lastFocus.focus()}

/* Modal with fallback for browsers without <dialog> */
var co=$("#co"),hasDialog=typeof co.showModal==="function";
function openCo(){$("#form").hidden=false;$("#done").hidden=true;$("#coTotal").textContent=money(totals().s+ship());
 if(hasDialog)co.showModal();else{co.className+=" fallback";co.setAttribute("open","")}$("#name").focus()}
function closeCo(){if(hasDialog)co.close();else co.removeAttribute("open")}
function ship(){var s=totals().s;return s&&s<999?60:0}

/* Validation */
var rules={name:[/^[A-Za-z][A-Za-z .'-]{1,59}$/,"Enter your full name (letters only)."],
 email:[/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,"Enter a valid email, like name@example.com."],
 phone:[/^[6-9]\d{9}$/,"Enter a 10-digit mobile number starting with 6-9."],
 pin:[/^[1-9]\d{5}$/,"Enter a valid 6-digit PIN code."]};
function check(k){var i=$("#"+k),ok=rules[k][0].test(i.value.trim());$("#e-"+k).textContent=ok?"":rules[k][1];i.setAttribute("aria-invalid",ok?"false":"true");return ok}

function init(){
 load();renderChips();renderGrid();renderCart();
 $("#q").addEventListener("input",function(e){state.q=e.target.value;renderGrid()});
 $("#sort").addEventListener("change",function(e){state.sort=e.target.value;renderGrid()});
 $("#chips").addEventListener("click",function(e){var t=e.target.getAttribute("data-type");if(t){state.type=t;renderChips();renderGrid()}});
 $("#grid").addEventListener("click",function(e){var id=e.target.getAttribute("data-add");if(id){change(id,1);toast(byId(+id).name+" added to cart")}});
 $("#items").addEventListener("click",function(e){var t=e.target;
  if(t.getAttribute("data-inc"))change(t.getAttribute("data-inc"),1);
  else if(t.getAttribute("data-dec"))change(t.getAttribute("data-dec"),-1);
  else if(t.getAttribute("data-rm")){delete state.cart[t.getAttribute("data-rm")];save();renderCart()}});
 $("#cartBtn").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#ov").addEventListener("click",closeCart);
 document.addEventListener("keydown",function(e){if(e.key==="Escape"||e.key==="Esc"){if(!hasDialog&&co.hasAttribute("open"))closeCo();closeCart()}});
 $("#checkout").addEventListener("click",function(){closeCart();openCo()});
 $("#coCancel").addEventListener("click",closeCo);
 Object.keys(rules).forEach(function(k){$("#"+k).addEventListener("blur",function(){check(k)})});
 $("#form").addEventListener("submit",function(e){e.preventDefault();
  var ok=true;Object.keys(rules).forEach(function(k){if(!check(k))ok=false});
  if(!ok){var bad=document.querySelector('[aria-invalid="true"]');if(bad)bad.focus();return}
  var id="SW"+Date.now().toString().slice(-6),name=$("#name").value.trim().split(" ")[0];
  $("#doneMsg").textContent="Thanks, "+name+". Order "+id+" for "+money(totals().s+ship())+" is confirmed. A receipt goes to "+$("#email").value.trim()+".";
  state.cart={};save();renderCart();$("#form").reset();$("#form").hidden=true;$("#done").hidden=false;$("#doneBtn").focus()});
 $("#doneBtn").addEventListener("click",closeCo);
 $("#theme").addEventListener("click",function(){var r=document.documentElement,dark=r.getAttribute("data-theme")==="dark"||(!r.getAttribute("data-theme")&&window.matchMedia&&matchMedia("(prefers-color-scheme:dark)").matches);
  var n=dark?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem("sw-theme",n)}catch(e){}});
}
init();
})();
