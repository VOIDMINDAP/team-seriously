(()=>{const EP='https://fra.cloud.appwrite.io/v1',PJ='teamseriously',BK='clips',DB='ts',CO='slots',MAX=300*1024*1024,PART=45*1024*1024,CH=5*1024*1024;
const $=s=>document.querySelector(s),box=$('#clips'),esc=t=>String(t||'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const EM='teamseriously+clan@mail.grokbot.com',FK='ts_aw_fb';const H={'X-Appwrite-Project':PJ};
const hd=(x={})=>{const f=localStorage.getItem(FK);return f?{...H,...x,'X-Fallback-Cookies':f}:{...H,...x}};
const keep=r=>{const f=r.headers.get('X-Fallback-Cookies');if(f)localStorage.setItem(FK,f);return r};
const api=(p,o={})=>fetch(EP+p,{credentials:'include',...o,headers:hd(o.headers)}).then(keep);
let ME=null;const who=()=>api('/account').then(r=>r.ok).catch(()=>false).then(v=>ME=v);
const login=k=>api('/account/sessions/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:EM,password:k})}).then(r=>{if(!r.ok)throw new Error('Clave incorrecta');ME=true});
const salir=()=>api('/account/sessions/current',{method:'DELETE'}).finally(()=>{localStorage.removeItem(FK);ME=false;render()});const view=id=>`${EP}/storage/buckets/${BK}/files/${id}/view?project=${PJ}`;
const OK=/\.(mp4|webm|mov)$/i,TYPES='video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov';let S={};
const YTP={'peJ0uiM1i6g':'img/clips/replica-thumb.jpg'};
const empty=n=>`<div class="clip empty reveal in" data-slot="${n}" role="button" tabindex="0" aria-label="Subir clip al espacio ${n}"><div class="screen">+</div><div class="cap"><b>SUBE TU CLIP</b></div></div>`;
const full=(n,d)=>`<button class="clip filled reveal in" data-slot="${n}"><div class="screen">${d.ytId?`<img class="poster" src="${YTP[d.ytId]||`https://i.ytimg.com/vi/${d.ytId}/maxresdefault.jpg`}" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${d.ytId}/hqdefault.jpg'" alt="" loading="lazy">`:d.posterId?`<img class="poster" src="${view(d.posterId)}" alt="" loading="lazy">`:d.parts?'':`<video class="poster" src="${view(d.fileId)}#t=0.5" preload="metadata" muted playsinline></video>`}<span class="play">▶</span></div><div class="cap"><b>${esc(d.title)||'CLIP '+n}</b><span>Registro de combate · ${n}</span></div></button>`;
const render=()=>{box.innerHTML=[1,2,3,4].map(n=>S[n]?full(n,S[n]):empty(n)).join('');
 let so=document.getElementById('clips-salir');if(!so){so=document.createElement('div');so.id='clips-salir';box.after(so)}so.innerHTML=ME?'<a class="salir" href="#">salir</a>':'';so.querySelectorAll('.salir').forEach(a=>a.onclick=e=>{e.preventDefault();e.stopPropagation();salir()});box.querySelectorAll('.clip.empty').forEach(c=>{c.onclick=()=>form(c);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();form(c)}}});
 box.querySelectorAll('.clip.filled').forEach(c=>c.onclick=()=>play(S[c.dataset.slot]))};
const load=()=>fetch(`${EP}/databases/${DB}/collections/${CO}/documents?project=${PJ}`,{headers:H}).then(r=>r.json()).then(j=>{S={};(j.documents||[]).forEach(d=>S[d.slot]=d);render()}).catch(render);
function play(d){TS_open(`<div class="lightbox"><div class="modal-h">${esc(d.title)||'CLIP '+d.slot}</div><div class="lb-stage">${d.ytId?`<div class="lb-yt"><iframe src="https://www.youtube-nocookie.com/embed/${d.ytId}?autoplay=1&rel=0&playsinline=1" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen title="Clip"></iframe></div>`:`<video ${d.parts?'':`src="${view(d.fileId)}"`} ${d.posterId?`poster="${view(d.posterId)}"`:''} controls autoplay playsinline></video>`}<button class="lb-fs" aria-label="Pantalla completa">⛶ PANTALLA COMPLETA</button></div></div>`);
 const st=$('.lb-stage'),v=st.querySelector('video');if(v&&d.parts)joinParts(d,v,st);TS_dlg.classList.add('wide');
 st.querySelector('.lb-fs').onclick=()=>{const f=document.fullscreenElement||document.webkitFullscreenElement;if(f)return(document.exitFullscreen||document.webkitExitFullscreen).call(document);
  if(st.requestFullscreen)st.requestFullscreen().catch(()=>v&&v.webkitEnterFullscreen&&v.webkitEnterFullscreen());else if(st.webkitRequestFullscreen)st.webkitRequestFullscreen();else if(v&&v.webkitEnterFullscreen)v.webkitEnterFullscreen()}}
TS_dlg.addEventListener('close',()=>TS_dlg.classList.remove('wide'));
function form(c){if(c.querySelector('form'))return;const n=+c.dataset.slot;
 c.innerHTML=`<form class="up"><div class="screen"><label class="pick">+<input type="file" accept="${TYPES}" hidden></label><div class="bar" hidden><i></i><em>0%</em></div></div><div class="cap"><input class="ttl" maxlength="60" placeholder="TÍTULO (OPCIONAL)">${ME?'':'<input class="clave" type="password" autocomplete="current-password" placeholder="CLAVE DEL ESCUADRÓN">'}<span class="msg">Elige un video · máx. 300 MB</span>${ME?' <a class="salir" href="#">salir</a>':''}</div></form>`;
 const so=c.querySelector('.salir');if(so)so.onclick=e=>{e.preventDefault();e.stopPropagation();salir()};
 const f=c.querySelector('input[type=file]'),msg=c.querySelector('.msg');c.onclick=null;if(ME)f.click();else{const k=c.querySelector('.clave');k.focus();k.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();f.click()}}}
 f.onchange=async()=>{const file=f.files[0];if(!file)return;
  if(!OK.test(file.name))return msg.textContent='Formato no válido: usa MP4, WEBM o MOV';
  if(file.size>MAX)return msg.textContent='Archivo demasiado grande (máx. 300 MB)';
  c.querySelector('.pick').hidden=true;const bar=c.querySelector('.bar');bar.hidden=false;
  const prog=p=>{bar.querySelector('i').style.width=p+'%';bar.querySelector('em').textContent=Math.round(p)+'%'};
  try{if(!ME){const k=c.querySelector('.clave');if(!k.value)throw new Error('Escribe la clave del escuadrón');msg.textContent='Verificando clave…';await login(k.value);k.remove()}msg.textContent='Transmitiendo…';const ttl=c.querySelector('.ttl').value.trim().slice(0,60);
   const st=await fn({action:'start',slot:n,size:file.size,mime:file.type||'video/mp4',title:ttl});
   if(st.uploadUrl){const yv=await ytPut(st.uploadUrl,file,p=>prog(p*.97));const fin=await fn({action:'finish',slot:n,videoId:yv.id,title:ttl});if(!fin.ok)throw new Error(fin.error==='DB'&&fin.status===409?'Este espacio ya fue ocupado':'No se pudo registrar');prog(100);return await load()}
   if(st.error==='SLOT_TAKEN')throw new Error('Este espacio ya fue ocupado');if(st.error!=='NOT_CONFIGURED')throw new Error(st.error==='FORBIDDEN'?'Clave requerida':'YouTube no respondió');
   const poster=await thumb(file).catch(()=>null);
   const np=Math.ceil(file.size/PART),ids=[];for(let i=0;i<np;i++){const a=i*PART,bl=file.slice(a,Math.min(a+PART,file.size)),pf=np>1?new File([bl],'part'+i+file.name.slice(file.name.lastIndexOf('.')),{type:file.type}):file;
    ids.push((await upload(pf,p=>prog((a+p/100*bl.size)/file.size*95))).$id)}const vid={$id:ids[0]};let pid=null;
   if(poster)pid=(await upload(new File([poster],'poster.jpg',{type:'image/jpeg'}),()=>{}).catch(()=>({})))?.$id||null;
   const r=await api(`/databases/${DB}/collections/${CO}/documents`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({documentId:'slot'+n,data:{slot:n,title:ttl,fileId:vid.$id,posterId:pid,parts:np>1?ids.join(','):null,size:file.size,mime:file.type.slice(0,40)}})});
   if(!r.ok)throw new Error(r.status===401?'Clave requerida':r.status===409?'Este espacio ya fue ocupado':'No se pudo registrar');prog(100);await load()}
  catch(e){if(/Clave/.test(e.message)&&!ME){}msg.textContent=e.message||'Error al subir';bar.hidden=true;c.querySelector('.pick').hidden=false;f.value=''}}}
async function fn(body){const r=await api('/functions/yt/executions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body:JSON.stringify(body),async:false,method:'POST',path:'/',headers:{'content-type':'application/json'}})});
 if(r.status===401)throw new Error('Clave requerida');const e=await r.json();let j={};try{j=JSON.parse(e.responseBody||'{}')}catch(_){}return j}
function ytPut(url,file,on){return new Promise((ok,ko)=>{const x=new XMLHttpRequest();x.open('PUT',url);x.setRequestHeader('Content-Type',file.type||'video/mp4');x.upload.onprogress=e=>on(e.loaded/e.total*100);
 x.onload=()=>{let j={};try{j=JSON.parse(x.responseText)}catch(_){}x.status<300&&j.id?ok(j):ko(new Error('YouTube rechazó el video'))};x.onerror=()=>ko(new Error('Error de red con YouTube'));x.send(file)})}
async function joinParts(d,v,st){const ids=d.parts.split(','),tot=d.size||0;let got=0;const bx=document.createElement('div');bx.className='bar lb-bar';bx.innerHTML='<i></i><em>CARGANDO 0%</em>';st.appendChild(bx);
 const bufs=[];try{for(const id of ids){const r=await fetch(view(id));if(!r.ok)throw 0;const rd=r.body.getReader();for(;;){const {done,value}=await rd.read();if(done)break;bufs.push(value);got+=value.length;const p=tot?Math.min(100,got/tot*100):0;bx.querySelector('i').style.width=p+'%';bx.querySelector('em').textContent='CARGANDO '+Math.round(p)+'%'}}
 if(!v.isConnected)return;const u=URL.createObjectURL(new Blob(bufs,{type:d.mime||'video/mp4'}));v.src=u;bx.remove();v.play().catch(()=>{});TS_dlg.addEventListener('close',()=>URL.revokeObjectURL(u),{once:true})}catch(e){bx.querySelector('em').textContent='ERROR AL CARGAR'}}
function upload(file,on){return new Promise(async(res,rej)=>{let id=null,off=0,last;
 while(off<file.size){const end=Math.min(off+CH,file.size);const fd=new FormData();fd.append('fileId',id||'unique()');fd.append('file',file.slice(off,end),file.name);
  try{last=await new Promise((ok,ko)=>{const x=new XMLHttpRequest();x.open('POST',`${EP}/storage/buckets/${BK}/files`);x.withCredentials=true;Object.entries(hd()).forEach(([a,b])=>x.setRequestHeader(a,b));
   if(file.size>CH)x.setRequestHeader('Content-Range',`bytes ${off}-${end-1}/${file.size}`);if(id)x.setRequestHeader('X-Appwrite-ID',id);
   x.upload.onprogress=e=>on((off+e.loaded*(end-off)/e.total)/file.size*100);
   x.onload=()=>{let j={};try{j=JSON.parse(x.responseText)}catch(_){}const fb=x.getResponseHeader('X-Fallback-Cookies');if(fb)localStorage.setItem(FK,fb);x.status<300?ok(j):ko(x.status===401?new Error('Clave requerida'):new Error(j.message||'Error al subir'))};x.onerror=()=>ko(new Error('Error de red'));x.send(fd)})}catch(e){return rej(e)}
  id=last.$id;off=end}res(last)})}
function thumb(file){return new Promise((res,rej)=>{const v=document.createElement('video'),u=URL.createObjectURL(file);v.muted=true;v.playsInline=true;v.preload='auto';v.src=u;
 const t=setTimeout(()=>rej(),8000);v.onerror=()=>{clearTimeout(t);rej()};v.onloadeddata=()=>{v.currentTime=Math.min(1,(v.duration||2)/3)};
 v.onseeked=()=>{const k=document.createElement('canvas'),w=Math.min(960,v.videoWidth||960);k.width=w;k.height=Math.round(w*(v.videoHeight||540)/(v.videoWidth||960));
  k.getContext('2d').drawImage(v,0,0,k.width,k.height);k.toBlob(b=>{clearTimeout(t);URL.revokeObjectURL(u);b?res(b):rej()},'image/jpeg',.82)}})}
render();who().then(load)})();
