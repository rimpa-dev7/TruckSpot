const T=[
{id:1,n:"Smoky Wheels",c:"BBQ",e:"🍖",col:"#FFC24B",x:100,y:70,s:11,t:21,d:"0.2 km",m:[["Pulled pork bun",8],["Brisket tray",12],["Slaw cup",3]]},
{id:2,n:"Taco Tornado",c:"Mexican",e:"🌮",col:"#FF7A3D",x:235,y:160,s:12,t:23,d:"0.4 km",m:[["Al pastor taco",4],["Burrito bowl",9],["Churros",5]]},
{id:3,n:"Curry in a Hurry",c:"Indian",e:"🍛",col:"#7be0a8",x:60,y:160,s:10.5,t:20,d:"0.5 km",m:[["Butter chicken wrap",8],["Veg samosas",4],["Mango lassi",3]]},
{id:4,n:"Bao Bound",c:"Asian",e:"🥟",col:"#9ED0FF",x:235,y:70,s:17,t:24,d:"0.7 km",m:[["Pork belly bao",6],["Kimchi dumplings",7],["Bubble tea",5]]},
{id:5,n:"Green Machine",c:"Vegan",e:"🥗",col:"#c4f27c",x:150,y:245,s:9,t:17,d:"0.3 km",m:[["Falafel bowl",9],["Cold-press juice",5],["Chickpea fries",4]]},
{id:6,n:"Sugar Rush",c:"Dessert",e:"🍩",col:"#ffb5d8",x:150,y:70,s:14,t:22,d:"0.6 km",m:[["Mini donuts",5],["Waffle cone",6],["Hot chocolate",4]]}];
const $=s=>document.querySelector(s);
const hr=()=>{const d=new Date();return d.getHours()+d.getMinutes()/60};
const isOpen=t=>hr()>=t.s&&hr()<t.t;
const fmt=h=>{const H=Math.floor(h)%24,M=h%1?"30":"00";return `${H%12||12}:${M} ${H<12?"AM":"PM"}`};
const rng=t=>`${fmt(t.s)} – ${fmt(t.t)}`;
const tag=t=>`<span class="tg ${isOpen(t)?"on":"off"}">${isOpen(t)?"Open now":"Closed now"}</span>`;
const cats=["All","Open now",...new Set(T.map(t=>t.c))];
let f="All",sel=null;
const vis=t=>f==="All"||(f==="Open now"?isOpen(t):t.c===f);
$("#bulbs").innerHTML=Array.from({length:22},(_,i)=>{const x=i*46+10;const y=8+Math.sin(i/3.5)*18+14;return `<circle cx="${x}" cy="${Math.round(y)}" r="5"/>`}).join("");
function fc(){$("#fc").innerHTML=cats.slice(0,6).map(c=>`<button class="fc" aria-pressed="${c===f}" data-c="${c}">${c}</button>`).join("")}
function pins(){$("#pins").innerHTML=T.filter(vis).map(t=>`<g class="pin" tabindex="0" role="button" aria-label="${t.n}, ${t.c}" data-id="${t.id}" transform="translate(${t.x} ${t.y})"><circle r="${sel===t.id?20:16}" fill="${t.col}" stroke="#2A1459" stroke-width="3"/><text y="6" text-anchor="middle" font-size="${sel===t.id?20:16}">${t.e}</text></g>`).join("")}
function sheet(){const t=T.find(x=>x.id===sel);$("#sheet").innerHTML=t?`<h3>${t.e} ${t.n}</h3><small>${t.c} · ${t.d} away</small> ${tag(t)}<div style="font-size:.8rem;color:var(--mut);margin-top:2px">Today ${rng(t)}</div><ul>${t.m.map(i=>`<li><span>${i[0]}</span><b>$${i[1]}</b></li>`).join("")}</ul>`:`<h3>Tap a truck</h3><small>${T.filter(isOpen).length} trucks open near you right now</small>`}
$("#fc").onclick=e=>{const b=e.target.closest("button");if(!b)return;f=b.dataset.c;const s=T.find(x=>x.id===sel);if(s&&!vis(s))sel=null;fc();pins();sheet()};
const pick=p=>{if(p){sel=+p.dataset.id;pins();sheet()}};
$("#pins").onclick=e=>pick(e.target.closest(".pin"));
$("#pins").onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(e.target.closest(".pin"))}};
$("#slider").innerHTML=T.map(t=>`<article class="card"><div class="hd" style="background:${t.col}">${t.e}</div><div class="bd"><h3>${t.n}</h3><small style="color:var(--mut)">${t.c} · ${t.d}</small><ul>${t.m.map(i=>`<li><span>${i[0]}</span><b>$${i[1]}</b></li>`).join("")}</ul>${tag(t)} <small style="color:var(--mut)">${rng(t)}</small></div></article>`).join("");
const ticks=Array.from({length:18},(_,i)=>`<span>${(i+7)%12||12}${i+7<12||i+7>=24?"a":"p"}</span>`).join("");
const n=hr(),np=Math.min(Math.max((n-7)/18,0),1)*100;
$("#tl").innerHTML=`<div class="ax"><span></span>${ticks}</div>`+T.map(t=>{const l=(Math.max(t.s,7)-7)/18*100,w=(Math.min(t.t,25)-Math.max(t.s,7))/18*100;return `<div class="rw"><span style="font-weight:600;font-size:.9rem">${t.e} ${t.n}</span><div class="bar"><i style="left:${l}%;width:${w}%;background:${t.col}"></i></div></div>`}).join("")+`<div style="position:absolute;left:150px;right:0;top:0;bottom:0;pointer-events:none"><div class="now" style="left:${np}%"></div></div>`;
const msg=t=>$("#msg").textContent=t;
$("#form").onsubmit=e=>{e.preventDefault();try{const l=JSON.parse(localStorage.getItem("ts_emails")||"[]");l.push($("#email").value.trim());localStorage.setItem("ts_emails",JSON.stringify(l))}catch(_){}
 msg("You’re in. We’ll email you truck updates.");$("#email").value=""};
$("#push").onclick=async()=>{if(!("Notification" in window)){msg("Browser alerts aren’t supported here. Use email instead.");return}
 try{const p=await Notification.requestPermission();msg(p==="granted"?"Browser alerts are on.":"Alerts are blocked. Allow them in browser settings, or use email.")}catch(_){msg("Couldn’t turn on alerts here. Use email instead.")}};
fc();pins();sheet();
