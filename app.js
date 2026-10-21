(()=>{const C=window.TS_CONFIG||{miembros:{},clips:[]};const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;const $=s=>document.querySelector(s);
const M=[
{id:'mono',n:'MONO',r:'El Primero en Entrar',c:'#c23a1e',s:[['Asalto',95],['Instinto',90],['Caos',99]],b:['Cuentan que cuando el escuadrón dudaba, Mono ya estaba del otro lado de la línea enemiga. No espera órdenes: él es la orden.','Su risa por el radio es la señal de que la batalla empezó. Dicen que nunca ha retrocedido un paso… y que si lo hizo, fue para tomar impulso.','Donde cae Mono, se abre el camino para los demás.']},
{id:'replica',n:'REPLICA',r:'El Eco Imparable',c:'#b8892e',s:[['Precisión',97],['Adaptación',99],['Paciencia',88]],b:['Lo que ve, lo aprende. Lo que aprende, lo perfecciona. Replica estudia al enemigo hasta convertirse en su sombra y devolverle cada golpe, multiplicado.','La leyenda dice que nadie le ha ganado dos veces con el mismo truco. A la segunda, el truco ya es suyo.','Un eco que no se apaga: cuanto más fuerte golpeas, más fuerte regresa.']},
{id:'terrific',n:'TERRIFIC',r:'El Muro de Hierro',c:'#6f8a8f',s:[['Resistencia',99],['Táctica',94],['Lealtad',100]],b:['Cuando todo arde, Terrific es lo que sigue en pie. Escudo, estratega y ancla del escuadrón: el que mantiene la posición mientras el mundo se cae a pedazos.','No busca la gloria del último golpe; busca que todos regresen a casa. Por eso su nombre se pronuncia con respeto en cada trinchera.','Mientras Terrific respire, la línea no se rompe.']},
{id:'spawn',n:'SPAWN',r:'El que Siempre Regresa',c:'#8d1c4a',s:[['Voluntad',100],['Sigilo',91],['Remontada',98]],b:['Lo han dado por muerto mil veces. Mil veces ha vuelto. Spawn es la prueba viva de que en Team Seriously nadie se queda abajo para siempre.','Aparece donde nadie lo espera, en el segundo exacto, y convierte una derrota segura en una historia que se contará por años.','Las cenizas no lo detienen: de ellas nace.']}];
const av=(m)=>`<svg class="avatar" viewBox="0 0 120 120"><defs><linearGradient id="g${m.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a433d"/><stop offset="1" stop-color="#1a1715"/></linearGradient></defs><polygon points="60,4 110,32 110,88 60,116 10,88 10,32" fill="url(#g${m.id})" stroke="${m.c}" stroke-width="4"/><use href="#emblem" x="20" y="20" width="80" height="80" style="color:#00000055"/><text x="60" y="78" text-anchor="middle" font-family="Black Ops One" font-size="54" fill="${m.c}" stroke="#000" stroke-width="2">${m.n[0]}</text></svg>`;
$('#squad').innerHTML=M.map(m=>`<button class="card plate reveal spk" data-id="${m.id}" style="--c:${m.c}">${av(m)}<h3>${m.n}</h3><div class="role">${m.r}</div><div class="more">VER EXPEDIENTE ▸</div></button>`).join('');
const dlg=$('#modal'),body=$('#modal-body');
const open=h=>{body.innerHTML=h;dlg.showModal()};
dlg.querySelector('.x').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});dlg.addEventListener('close',()=>{body.innerHTML='';if(location.hash.startsWith('#m-'))history.replaceState(null,'','#escuadron')});
const openM=id=>{const m=M.find(x=>x.id===id);if(!m)return;open(`<div class="mhead">${av(m)}<div><div class="role">Expediente clasificado</div><div class="modal-h" style="color:${m.c}">${m.n}</div><div class="role">${m.r}</div></div></div>${m.b.map(p=>`<p>${p}</p>`).join('')}<div class="stats">${m.s.map(([k,v])=>`<div class="stat">${k} ${v}<i><b style="width:${v}%"></b></i></div>`).join('')}</div>`);history.replaceState(null,'','#m-'+id)};
document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openM(c.dataset.id));
if(location.hash.startsWith('#m-'))openM(location.hash.slice(3));
// En vivo
const host=location.hostname||'localhost';
$('#streams').innerHTML=M.map(m=>{const ch=((C.miembros[m.id]||{}).twitch||'').trim();
 const scr=ch?`<div class="screen"><iframe src="https://player.twitch.tv/?channel=${encodeURIComponent(ch)}&parent=${host}&muted=true&autoplay=false" allowfullscreen title="Twitch ${m.n}" loading="lazy"></iframe></div>`
 :`<div class="screen soon"><div><svg class="mini"><use href="#emblem"/></svg><div class="soon-t">PRÓXIMAMENTE</div><div class="soon-s">LA SEÑAL DE ${m.n} SE ESTÁ FORJANDO</div></div></div>`;
 return `<div class="stream plate reveal spk"><h3 style="color:${m.c}">● ${m.n}</h3>${scr}</div>`}).join('');
// Juegos
const G=[['Gears of War: E-Day','El regreso al origen','⚙','#a3120c'],['Dota 2','Ancestros en guerra','D2','#c23a1e'],['Counter-Strike 2','Plantar · Defender','CS','#d9a441'],['League of Legends','La Grieta nos llama','LoL','#3fa7b5'],['Apex Legends','Campeones de la arena','▲','#d6402b']];
$('#games').innerHTML=G.map(([t,s,i,c])=>`<div class="game plate reveal spk" style="--c:${c}"><div class="ico">${i}</div><h3>${t}</h3><p>${s}</p><div class="bar"></div></div>`).join('');
// Clips
const yt=u=>{const m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);return m&&m[1]};
const tw=u=>{const m=u.match(/clips\.twitch\.tv\/([\w-]+)/)||u.match(/twitch\.tv\/\w+\/clip\/([\w-]+)/);return m&&m[1]};
const embed=u=>{let id;if(id=yt(u))return`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" allow="autoplay;fullscreen" allowfullscreen></iframe>`;if(id=tw(u))return`<iframe src="https://clips.twitch.tv/embed?clip=${id}&parent=${host}&autoplay=true" allowfullscreen></iframe>`;return`<video src="${u}" controls autoplay style="width:100%;height:100%"></video>`};
const clips=(C.clips||[]).filter(c=>c&&c.url);
let h=clips.map((c,i)=>{const id=yt(c.url);const th=id?`style="background:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg) center/cover"`:'';return`<button class="clip plate reveal spk" data-i="${i}"><div class="screen" ${th}>▶</div><div class="cap"><b>${c.titulo||'Clip épico'}</b><span>${c.autor||''}</span></div></button>`}).join('');
for(let k=0;k<Math.max(1,4-clips.length);k++)h+=`<div class="clip empty reveal"><div class="screen">+</div><div class="cap"><b>SUBE TU CLIP</b><span>Agrégalo en data/config.js (ver README)</span></div></div>`;
$('#clips').innerHTML=h;document.querySelectorAll('.clip[data-i]').forEach(b=>b.onclick=()=>{const c=clips[b.dataset.i];open(`<div class="modal-h">${c.titulo||''}</div><div class="screen" style="margin-top:1rem">${embed(c.url)}</div>`)});
// Reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
if(RM)return;
document.body.classList.add('shake');
// Parallax
const px=document.querySelectorAll('.parallax');let tk=0;addEventListener('scroll',()=>{if(tk)return;tk=requestAnimationFrame(()=>{tk=0;px.forEach(p=>p.style.transform=`translateY(${scrollY*p.dataset.speed}px)`)})},{passive:true});
// Sparks on hover
let last=0;document.addEventListener('pointermove',e=>{const t=e.target.closest&&e.target.closest('.spk');const now=performance.now();if(!t||now-last<40)return;last=now;for(let i=0;i<3;i++){const s=document.createElement('span');s.className='spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';document.body.appendChild(s);const a=Math.random()*Math.PI*2,d=20+Math.random()*40;s.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+30}px)`,opacity:0}],{duration:500+Math.random()*300,easing:'ease-out'}).onfinish=()=>s.remove()}});
// Ash & embers canvas
const cv=$('#fx'),x=cv.getContext('2d');let W,H,P=[];const dpr=Math.min(devicePixelRatio||1,1.5);
const rs=()=>{W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr};rs();addEventListener('resize',rs);
const N=innerWidth<700?45:110;const mk=(y)=>({x:Math.random()*W,y:y??H+10,r:(Math.random()*2+.5)*dpr,vy:-(Math.random()*.6+.2)*dpr,vx:(Math.random()-.5)*.4*dpr,e:Math.random()<.35,ph:Math.random()*6});
for(let i=0;i<N;i++)P.push(mk(Math.random()*H));
// intro burst: embers converging
const B=[];for(let i=0;i<(innerWidth<700?60:140);i++){const a=Math.random()*6.28,d=(200+Math.random()*400)*dpr;B.push({a,d,t:0})}
const t0=performance.now();
(function loop(now){x.clearRect(0,0,W,H);const k=(now-t0)/2000;
 if(k<1){const cx=W/2,cy=H*0.38;B.forEach(b=>{const dd=b.d*(1-k);x.fillStyle=`rgba(255,${120+Math.random()*80|0},30,${1-k*.6})`;x.beginPath();x.arc(cx+Math.cos(b.a)*dd,cy+Math.sin(b.a)*dd,2*dpr,0,7);x.fill()})}
 P.forEach((p,i)=>{p.ph+=.02;p.x+=p.vx+Math.sin(p.ph)*.3;p.y+=p.vy;if(p.y<-10)P[i]=mk();
  if(p.e){x.fillStyle=`rgba(255,${100+(Math.sin(p.ph*3)*50|0)},20,${.5+Math.sin(p.ph*2)*.3})`;x.shadowBlur=8*dpr;x.shadowColor='#ff6a1a'}else{x.fillStyle='rgba(160,150,140,.35)';x.shadowBlur=0}
  x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()});x.shadowBlur=0;
 requestAnimationFrame(loop)})(t0);
})();
