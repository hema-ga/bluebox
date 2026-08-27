let revenue = Number(localStorage.getItem('revenue') || 0);
let orders = JSON.parse(localStorage.getItem('sales') || '[]');

function money(n){
  return '₹' + Number(n).toLocaleString('en-IN');
}

function save(){
  localStorage.setItem('revenue', revenue);
  localStorage.setItem('sales', JSON.stringify(orders));
}

function render(){
  document.getElementById('revenue').textContent = money(revenue);
  document.getElementById('todayRevenue').textContent = money(revenue);
  document.getElementById('orders').textContent = orders.length;
  document.getElementById('average').textContent = orders.length ? money(revenue/orders.length) : '₹0';

  if(orders.length){
    document.getElementById('lastSale').textContent = money(orders[0].amount);
    document.getElementById('lastItem').textContent = orders[0].item;
  }

  const list=document.getElementById('historyList');
  if(!orders.length){
    list.innerHTML='<div class="empty">No sales yet. Click an item above.</div>';
    return;
  }

  list.innerHTML=orders.slice(0,10).map(s =>
    `<div class="sale"><div><b>${s.item}</b><br><small>${s.time}</small></div><b>+ ${money(s.amount)}</b></div>`
  ).join('');
}

function addSale(amount,item){
  revenue += amount;
  orders.unshift({amount,item,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
  save();
  render();
  showToast(`Sale added: ${item} · ${money(amount)}`);
}

function addCustomSale(){
  const input=document.getElementById('customAmount');
  const amount=Number(input.value);
  if(!amount || amount<1){
    showToast('Enter a valid amount');
    return;
  }
  addSale(amount,'Custom sale');
  input.value='';
}

function resetData(){
  if(confirm('Reset all sales and revenue?')){
    revenue=0;
    orders=[];
    save();
    render();
    showToast('Revenue reset');
  }
}

function showToast(text){
  const t=document.getElementById('toast');
  t.textContent=text;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1400);
}

render();
