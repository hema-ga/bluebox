const foods=[
{id:1,name:"Classic Burger",cat:"Burgers",price:120,emoji:"🍔",desc:"Juicy patty, fresh lettuce & our house sauce."},
{id:2,name:"Cheesy Pizza",cat:"Pizza",price:240,emoji:"🍕",desc:"Golden cheese, tomato sauce and herbs."},
{id:3,name:"Paneer Wrap",cat:"Wraps",price:150,emoji:"🌯",desc:"Spiced paneer, crunchy veggies and creamy sauce."},
{id:4,name:"Loaded Fries",cat:"Sides",price:90,emoji:"🍟",desc:"Crispy fries loaded with cheese and seasoning."},
{id:5,name:"Cold Coffee",cat:"Drinks",price:70,emoji:"🥤",desc:"Chilled, creamy and just the right amount of sweet."},
{id:6,name:"Chocolate Cake",cat:"Desserts",price:110,emoji:"🍰",desc:"Soft chocolate cake with rich frosting."},
{id:7,name:"Veggie Pizza",cat:"Pizza",price:210,emoji:"🍕",desc:"Bell peppers, onions, corn and mozzarella."},
{id:8,name:"Crispy Burger",cat:"Burgers",price:140,emoji:"🍔",desc:"Crunchy golden filling with fresh salad."},
{id:9,name:"Masala Fries",cat:"Sides",price:100,emoji:"🍟",desc:"Fries tossed in a spicy house masala."}
];
let cart=JSON.parse(localStorage.getItem("ff_cart")||"[]");
function money(n){return "₹"+Math.round(n).toLocaleString("en-IN")}
function save(){localStorage.setItem("ff_cart",JSON.stringify(cart));updateCount()}
function updateCount(){const el=document.getElementById("cartCount");if(el)el.textContent=cart.reduce((a,x)=>a+x.qty,0)}
function card(f){return `<article class="food-card"><div class="food-pic">${f.emoji}</div><h3>${f.name}</h3><p>${f.desc}</p><div class="food-bottom"><b>${money(f.price)}</b><button class="add" onclick="add(${f.id})">+ Add</button></div></article>`}
function renderMenu(list=foods){const g=document.getElementById("menuGrid");if(g)g.innerHTML=list.map(card).join("")}
function add(id){const f=foods.find(x=>x.id===id),x=cart.find(x=>x.id===id);x?x.qty++:cart.push({id:f.id,qty:1});save();toast(`${f.name} added to cart`)}
function renderFeatured(){const g=document.getElementById("featured");if(g)g.innerHTML=foods.slice(0,6).map(card).join("")}
function renderCart(){
 const box=document.getElementById("cartItems");if(!box)return;
 if(!cart.length){box.innerHTML=`<div style="text-align:center;padding:50px"><div style="font-size:55px">🛒</div><h2>Your cart is empty</h2><p>Go find something delicious.</p><a class="btn" href="menu.html">Browse Menu</a></div>`;document.getElementById("subtotal").textContent="₹0";document.getElementById("total").textContent="₹40";return}
 box.innerHTML=cart.map(x=>{const f=foods.find(y=>y.id===x.id);return `<div class="cart-row"><div class="cart-emoji">${f.emoji}</div><div><b>${f.name}</b><small style="display:block;color:#888">${money(f.price)} each</small></div><div class="qty"><button onclick="change(${f.id},-1)">−</button> ${x.qty} <button onclick="change(${f.id},1)">+</button></div><b>${money(f.price*x.qty)}</b></div>`}).join("");
 const sub=cart.reduce((a,x)=>a+foods.find(f=>f.id===x.id).price*x.qty,0);
 document.getElementById("subtotal").textContent=money(sub);document.getElementById("total").textContent=money(sub+40)
}
function change(id,n){const x=cart.find(x=>x.id===id);x.qty+=n;if(x.qty<=0)cart=cart.filter(x=>x.id!==id);save();renderCart()}
function completeOrder(){
 if(!cart.length){toast("Your cart is empty");return}
 const sub=cart.reduce((a,x)=>a+foods.find(f=>f.id===x.id).price*x.qty,0),order={id:"FF"+Date.now().toString().slice(-5),amount:sub+40,items:cart.reduce((a,x)=>a+x.qty,0),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})};
 let sales=JSON.parse(localStorage.getItem("ff_sales")||"[]");sales.unshift(order);localStorage.setItem("ff_sales",JSON.stringify(sales));cart=[];save();alert(`Order placed!\\nOrder #${order.id}\\nTotal: ${money(order.amount)}`);location.href="admin.html"
}
function renderAdmin(){
 const sales=JSON.parse(localStorage.getItem("ff_sales")||"[]"),rev=sales.reduce((a,x)=>a+x.amount,0),items=sales.reduce((a,x)=>a+x.items,0);
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};set("bizRevenue",money(rev));set("bizOrders",sales.length);set("bizAvg",sales.length?money(rev/sales.length):"₹0");set("bizItems",items);
 const r=document.getElementById("recentOrders");if(r)r.innerHTML=sales.slice(0,8).map(x=>`<div class="order-line"><span>#${x.id} · ${x.items} item(s) · ${x.time}</span><b>${money(x.amount)}</b></div>`).join("")||"<p style='color:#999;font-size:12px'>No orders yet. Place one from the Menu.</p>";
 const bars=document.getElementById("bars");if(bars){let vals=sales.slice(0,7).reverse().map(x=>x.amount);if(!vals.length)vals=[0];let max=Math.max(...vals,1);bars.innerHTML=vals.map((v,i)=>`<div class="bar" style="height:${Math.max(7,v/max*190)}px"><span>${money(v)}</span></div>`).join("")}
}
function demoSale(){const f=foods[Math.floor(Math.random()*foods.length)];let sales=JSON.parse(localStorage.getItem("ff_sales")||"[]");sales.unshift({id:"DEMO"+Date.now().toString().slice(-4),amount:f.price,items:1,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit")});localStorage.setItem("ff_sales",JSON.stringify(sales));renderAdmin();toast("Demo sale added")}
function toast(t){const e=document.getElementById("toast")||(()=>{const x=document.createElement("div");x.id="toast";document.body.appendChild(x);return x})();e.textContent=t;e.style.cssText="position:fixed;right:20px;bottom:20px;background:#203c2a;color:#fff;padding:12px 17px;border-radius:10px;font-size:12px;z-index:20";setTimeout(()=>e.remove(),1500)}
document.addEventListener("DOMContentLoaded",()=>{updateCount();renderFeatured();renderMenu();renderCart();renderAdmin();
document.querySelectorAll(".categories button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");renderMenu(b.dataset.cat==="all"?foods:foods.filter(f=>f.cat===b.dataset.cat))});
const co=document.getElementById("checkout");if(co)co.onclick=completeOrder;const ds=document.getElementById("addDemo");if(ds)ds.onclick=demoSale;
const cf=document.getElementById("contactForm");if(cf)cf.onsubmit=e=>{e.preventDefault();alert("Thanks! Your message has been received.");cf.reset()}
})