
const core=window.LATINOS_CORE;
if(!core)throw Error('No se pudo iniciar la comunidad');
const db=core.db;
const $=id=>document.getElementById(id);
const esc=core.esc;
const cats={
'Servicios':{icon:'🛠️',tag:'Servicio profesional',intro:'Cuéntanos qué haces y cómo pueden contratarte.',price:'Precio desde (€)',fields:[
['service','¿Qué servicio ofreces?','select',['Reparaciones','Limpieza','Construcción','Mecánica','Tecnología','Clases particulares','Fotografía','Otro'],true],
['mode','¿Dónde trabajas?','select',['A domicilio','Local propio','Online','En toda la provincia']],
['schedule','Horario disponible','text',null,false,'Ej. Lun–Sáb, 09:00–20:00'],
['experience','Experiencia','select',['Menos de 1 año','1–3 años','3–5 años','Más de 5 años']],
['appointment','¿Se necesita cita?','select',['Sí','No','Depende del trabajo']]]},
'Belleza':{icon:'💅',tag:'Belleza y bienestar',intro:'Muestra tus trabajos y facilita las reservas.',price:'Precio desde (€)',fields:[
['treatment','Especialidad','select',['Peluquería','Manicura y uñas','Pestañas','Cejas','Maquillaje','Barbería','Masajes','Otros'],true],
['mode','Atención','select',['En mi local','A domicilio','Ambas']],
['schedule','Horario','text',null,false,'Ej. De martes a sábado'],
['appointment','Reservas','select',['Con cita previa','Sin cita previa','Ambos']]]},
'Alquiler':{icon:'🏠',tag:'Vivienda',intro:'Publica una vivienda o explica qué estás buscando.',price:'Precio mensual (€)',fields:[
['operation','Tipo de anuncio','select',['Ofrezco alquiler','Busco alquiler'],true],
['property','Tipo de vivienda','select',['Habitación','Piso','Casa','Estudio','Local','Plaza de garaje','Otro'],true],
['rooms','Habitaciones','number',null,false,'Ej. 2'],
['baths','Baños','number',null,false,'Ej. 1'],
['area','Superficie (m²)','number',null,false,'Ej. 65'],
['deposit','Fianza (€)','number',null,false,'Si corresponde'],
['furnished','Amueblado','select',['Sí','No','Parcialmente','Indiferente']],
['availability','Disponible desde','date'],
['neighborhood','Barrio / zona','text',null,false,'Ej. Centro, La Granja'] ]},
'Compra y venta':{icon:'🛍️',tag:'Marketplace',intro:'Compra, vende o regala cerca de ti.',price:'Precio (€)',fields:[
['operation','¿Qué quieres hacer?','select',['Vendo','Busco','Regalo','Intercambio'],true],
['condition','Estado','select',['Nuevo','Como nuevo','Buen estado','Usado','Para reparar']],
['brand','Marca / modelo','text',null,false,'Opcional'],
['delivery','Entrega','select',['En mano','Envío','Ambas']],
['negotiable','Precio negociable','select',['No','Sí']]]},
'Transporte':{icon:'🚕',tag:'Viajes y movilidad',intro:'Indica el trayecto y cuándo necesitas viajar.',price:'Precio por trayecto (€)',fields:[
['operation','¿Ofreces o buscas transporte?','select',['Ofrezco transporte','Busco transporte'],true],
['origin','Lugar de salida','text',null,true,'Ej. Jerez centro'],
['destination','Destino','text',null,true,'Ej. Aeropuerto de Sevilla'],
['departure_date','Fecha de salida','date'],
['departure_time','Hora de salida','time'],
['seats','Plazas disponibles','number',null,false,'Ej. 3'],
['vehicle','Tipo de vehículo','select',['Coche','Furgoneta','Taxi / VTC','Otro']]]},
'Empleo':{icon:'💼',tag:'Oportunidades de trabajo',intro:'Publica una oferta o presenta tu experiencia.',price:'Salario (€) — opcional',fields:[
['operation','Tipo de anuncio','select',['Ofrezco empleo','Busco empleo'],true],
['profession','Profesión / puesto','text',null,true,'Ej. Camarero, albañil'],
['contract','Tipo de contrato','select',['Indefinido','Temporal','Por horas','Autónomo','A convenir']],
['shift','Jornada','select',['Completa','Media jornada','Fines de semana','Flexible']],
['experience','Experiencia','select',['Sin experiencia','1–2 años','3–5 años','Más de 5 años']],
['salary_period','Periodicidad del salario','select',['Mensual','Por hora','Por día','Por trabajo']]]},
'Comida':{icon:'🥘',tag:'Comida latina',intro:'Comparte tus platos y explica cómo pedirlos.',price:'Precio por pedido (€)',fields:[
['food','Tipo de comida','select',['Platos caseros','Postres','Catering','Panadería','Bebidas','Otros'],true],
['ordering','Pedidos','select',['Bajo pedido','Para hoy','Encargos para eventos']],
['delivery','Entrega','select',['Recogida','A domicilio','Ambas']],
['notice','Antelación','text',null,false,'Ej. Encargar con 24 horas'],
['quantity','Cantidad / raciones','text',null,false,'Ej. Bandeja para 4 personas']]]},
'Conocer gente':{icon:'🤝',tag:'Conexiones',intro:'Conoce gente nueva con respeto y privacidad.',price:null,fields:[
['purpose','Quiero conocer gente para','select',['Amistad','Deporte','Intercambio de idiomas','Actividades culturales','Planes en grupo','Networking'],true],
['interests','Mis intereses','text',null,false,'Ej. fútbol, cocina, viajes'],
['meeting','Plan ideal','text',null,false,'Ej. Café o paseo en grupo'],
['contact','Forma de contacto','select',['Por mi perfil','WhatsApp opcional']]]}
};
const allNames=Object.keys(cats);
const safeUrl=u=>typeof u==='string'&&/^https:\/\/[A-Za-z0-9._-]+\//.test(u)?esc(u):'';
function fieldHTML([key,label,kind,opts,required,placeholder],value){
 const id='type_'+key;const val=value??'';const req=required?' required':'';
 if(kind==='select')return '<div class="field v5-field"><label for="'+id+'">'+esc(label)+(required?' *':'')+'</label><select id="'+id+'" data-v5-key="'+key+'"'+req+'><option value="">Selecciona una opción</option>'+opts.map(o=>'<option value="'+esc(o)+'" '+(o===val?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
 const type=kind==='number'?'number':kind==='date'?'date':kind==='time'?'time':'text';
 const attrs=type==='number'?' min="0" max="10000000" step="1"':' maxlength="180"';
 return '<div class="field v5-field"><label for="'+id+'">'+esc(label)+(required?' *':'')+'</label><input id="'+id+'" data-v5-key="'+key+'" type="'+type+'"'+attrs+' value="'+esc(val)+'" placeholder="'+esc(placeholder||'')+'"'+req+'></div>';
}
let editingDetails={},modFilter='new',modPage=0,modToken=0,reportPost=null,modCache=[],modReports={},photoActive=0;
function paintTypeFields(){
 const cat=$('postCategory').value,info=cats[cat]||cats.Servicios,wrap=$('v5TypeFields');
 if(!wrap)return;
 wrap.innerHTML='<div class="v5-type-intro"><span>'+info.icon+'</span><div><b>'+esc(info.tag)+'</b><p>'+esc(info.intro)+'</p></div></div><div class="v5-fields-grid">'+info.fields.map(f=>fieldHTML(f,editingDetails)).join('')+'</div>';
 const priceField=$('postPrice')?.closest('.field');
 if(priceField){priceField.style.display=info.price===null?'none':'';priceField.querySelector('label').textContent=info.price||'Precio (€)';}
 document.querySelectorAll('[data-v5-cat]').forEach(b=>b.classList.toggle('active',b.dataset.v5Cat===cat));
}
function onEditorOpen(post=null){
 editingDetails=post?.details&&typeof post.details==='object'?post.details:{};
 const parent=$('postCategory')?.closest('.field'),form=$('postForm');
 if(!parent||!form)return;
 let picker=$('v5CategoryPicker'),fields=$('v5TypeFields');
 if(!picker){picker=document.createElement('section');picker.id='v5CategoryPicker';picker.className='v5-picker';parent.before(picker);}
 if(!fields){fields=document.createElement('section');fields.id='v5TypeFields';fields.className='v5-dynamic';parent.after(fields);}
 picker.innerHTML='<div class="v5-small-heading">1 · ELIGE QUÉ QUIERES PUBLICAR</div><div class="v5-types">'+allNames.map(n=>'<button class="v5-type-btn" type="button" data-v5-cat="'+esc(n)+'"><span>'+cats[n].icon+'</span><b>'+esc(n)+'</b></button>').join('')+'</div>';
 parent.classList.add('v5-native-cat');
 const title=$('editorTitle');if(title)title.textContent=post?'Editar publicación':'Crear publicación';
 const oldNote=$('publishingInfo');if(oldNote)oldNote.textContent='✅ Se publicará al instante. La comunidad puede denunciar contenido inapropiado.';
 const oldButton=$('submitPost');if(oldButton)oldButton.textContent=post?'Guardar cambios':'Publicar ahora';
 paintTypeFields();
}
function readDetails(){
 const out={};
 for(const e of document.querySelectorAll('#v5TypeFields [data-v5-key]')){const val=e.value.trim();if(val)out[e.dataset.v5Key]=e.type==='number'?Number(val):val;}
 return out;
}
function figure(p){return (p.images||[]).find(x=>safeUrl(x))||null}
function detailSpecs(p){const d=p.details||{},config=cats[p.category];if(!config)return [];return config.fields.filter(f=>d[f[0]]!==undefined&&d[f[0]]!=='').map(f=>({label:f[1],value:d[f[0]]}));}
function chipsFor(p){const d=p.details||{};if(p.category==='Alquiler')return [d.property,d.rooms?d.rooms+' hab.':'',d.area?d.area+' m²':''].filter(Boolean);
if(p.category==='Transporte')return [d.origin&&d.destination?d.origin+' → '+d.destination:'',d.departure_date||''].filter(Boolean);
if(p.category==='Empleo')return [d.operation,d.shift,d.contract].filter(Boolean).slice(0,2);
if(p.category==='Compra y venta')return [d.operation,d.condition].filter(Boolean);
if(p.category==='Servicios'||p.category==='Belleza')return [d.treatment||d.service,d.mode].filter(Boolean);
if(p.category==='Comida')return [d.food,d.delivery].filter(Boolean);
return [d.purpose,d.interests].filter(Boolean)}
function priceLabel(p){
 if(p.category==='Alquiler')return p.price==null?'Consultar':'€'+Number(p.price).toLocaleString('es-ES')+' / mes';
 if(p.category==='Conocer gente')return 'Conecta gratis';
 if(p.category==='Servicios'||p.category==='Belleza')return p.price==null?'Consultar': 'Desde '+core.money(p.price);
 if(p.category==='Empleo')return p.price==null?'A convenir':core.money(p.price)+' '+(p.details?.salary_period||'');
 if(p.category==='Transporte')return p.price==null?'A consultar':core.money(p.price)+' / viaje';
 return core.money(p.price);
}
function cardHtml(p){
 const cfg=cats[p.category]||{icon:'📣'},d=p.details||{},cover=figure(p);
 const fav=core.favorites.includes(p.id),specs=chipsFor(p);
 const extra=p.category==='Transporte'&&d.origin&&d.destination?'<div class="v5-route"><span>'+esc(d.origin)+'</span><b>➜</b><span>'+esc(d.destination)+'</span></div>':'';
 return '<article class="listing v5-listing cat-'+slug(p.category)+'" data-view="'+esc(p.id)+'" tabindex="0" role="button" aria-label="Abrir '+esc(p.title)+'">'+
 '<div class="photo v5-photo">'+(cover?'<img loading="lazy" src="'+safeUrl(cover)+'" alt="Foto de '+esc(p.title)+'">':'<div class="v5-image-placeholder"><span>'+cfg.icon+'</span><small>'+esc(cfg.tag||p.category)+'</small></div>')+
 '<span class="v5-overline">'+cfg.icon+' '+esc(p.category)+'</span><button type="button" class="fav" data-fav="'+esc(p.id)+'" aria-label="Guardar favorito">'+(fav?'♥':'♡')+'</button></div>'+
 '<div class="listing-body v5-listing-body">'+extra+'<h3>'+esc(p.title)+'</h3><strong class="v5-price">'+esc(priceLabel(p))+'</strong><div class="v5-card-chips">'+specs.slice(0,2).map(x=>'<span>'+esc(x)+'</span>').join('')+'</div><div class="v5-card-foot"><span>📍 '+esc(p.city)+'</span><span>Ver detalles ›</span></div></div></article>';
}
function slug(v){return (v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]+/g,'-')}
function detailHtml(p){
 const cfg=cats[p.category]||{icon:'📣'},d=p.details||{},images=(p.images||[]).filter(safeUrl),cover=images[0];
 const isOwner=core.user?.id===p.user_id,reported=p.status==='rejected',isAdmin=core.admin;
 const attr=detailSpecs(p);
 const spec='<div class="v5-spec-grid">'+attr.map(a=>'<div><small>'+esc(a.label)+'</small><strong>'+esc(String(a.value))+'</strong></div>').join('')+'</div>';
 const photos=cover?'<div class="v5-detail-photo"><img id="v5DetailMain" src="'+safeUrl(cover)+'" alt="'+esc(p.title)+'"></div><div class="v5-thumbs">'+images.map((src,i)=>'<button type="button" class="'+(i===0?'active':'')+'" data-v5-photo="'+i+'"><img src="'+safeUrl(src)+'" alt="Foto '+(i+1)+'"></button>').join('')+'</div>':'<div class="v5-detail-empty">'+cfg.icon+'</div>';
 const moderation=isAdmin?'<section class="v5-decision"><h3>🛡️ Decisión administrativa</h3><p>'+(!p.reviewed_at?'Sin revisar todavía':'Revisado anteriormente')+' · '+(reported?'Retirado de la comunidad':'Visible para la comunidad')+'</p><div class="v5-actions-row"><button class="v5-keep" data-v5-moderate="approved" data-v5-id="'+esc(p.id)+'">✓ Mantener / Aprobar</button><button class="v5-remove" data-v5-moderate="rejected" data-v5-id="'+esc(p.id)+'">⛔ Retirar anuncio</button></div></section>':'';
 return '<div class="v5-detail">'+photos+'<div class="v5-detail-kicker">'+cfg.icon+' '+esc(p.category)+' <span>· 📍 '+esc(p.city)+'</span></div>'+
 '<h2>'+esc(p.title)+'</h2><div class="v5-detail-price">'+esc(priceLabel(p))+'</div>'+
 (reported?'<div class="v5-warning">⛔ Este anuncio ha sido retirado por moderación.</div>':'')+
 '<div class="v5-detail-section"><h3>Descripción</h3><p class="v5-description">'+esc(p.description)+'</p></div>'+
 (attr.length?'<div class="v5-detail-section"><h3>Información del anuncio</h3>'+spec+'</div>':'')+
 '<button class="v5-seller" data-social-person="'+esc(p.user_id)+'"><span class="v5-seller-avatar">👤</span><span><b>'+esc(p.seller_name)+'</b><small>Ver perfil público ›</small></span></button>'+
 '<div class="v5-actions-row"><button class="secondary" data-fav="'+esc(p.id)+'">♡ Guardar</button><button class="secondary" id="shareDetail">↗ Compartir</button><button class="secondary" data-v5-report="'+esc(p.id)+'">⚑ Denunciar</button></div>'+
 (!reported&&p.whatsapp?'<button class="primary v5-contact" id="contactDetail">💬 Contactar por WhatsApp</button>':'')+
 (isOwner?'<div class="v5-actions-row">'+(p.status==='approved'?'<button class="secondary" id="editDetail">✎ Editar</button>':'')+'<button class="secondary" id="deleteDetail">Eliminar</button></div>':'')+
 moderation+'</div>';
}
function passwordToggle(){
 const input=$('authPassword');if(!input||$('passwordEye'))return;
 const wrap=document.createElement('div');wrap.className='v5-password-wrap';input.before(wrap);wrap.append(input);
 const button=document.createElement('button');button.type='button';button.id='passwordEye';button.className='v5-eye';button.textContent='👁️';button.setAttribute('aria-label','Mostrar contraseña');button.setAttribute('aria-pressed','false');
 button.addEventListener('click',()=>{const showing=input.type==='password';input.type=showing?'text':'password';button.textContent=showing?'🙈':'👁️';button.setAttribute('aria-label',showing?'Ocultar contraseña':'Mostrar contraseña');button.setAttribute('aria-pressed',String(showing))});wrap.append(button);
}
function addReportModal(){
 if($('v5ReportModal'))return;const wrap=document.createElement('div');wrap.id='v5ReportModal';wrap.className='modal-wrap';
 wrap.innerHTML='<div class="modal"><div class="modal-head"><b>⚑ Denunciar publicación</b><button class="close" data-close="v5ReportModal" type="button">×</button></div><form id="v5ReportForm" class="form"><p>Ayúdanos a mantener esta comunidad segura. Tu denuncia no será pública.</p><div class="field"><label>Motivo *</label><select id="v5ReportReason" required><option value="">Elige el motivo</option>'+['Spam','Fraude','Contenido inapropiado','Información falsa','Otro'].map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></div><div class="field"><label>Comentario (opcional)</label><textarea id="v5ReportComment" maxlength="500"></textarea></div><button class="primary" id="v5ReportSend">Enviar denuncia</button></form></div>';
 document.body.append(wrap);
 $('v5ReportForm').addEventListener('submit',sendReport);
}
async function sendReport(ev){
 ev.preventDefault();if(!core.user)return core.openAuth();
 const btn=$('v5ReportSend');btn.disabled=true;
 try{const r=await db.from('post_reports').insert({post_id:reportPost,reporter_id:core.user.id,reason:$('v5ReportReason').value,comment:$('v5ReportComment').value.trim()||null});if(r.error)throw r.error;core.modal('v5ReportModal',false);core.message('Gracias, el equipo revisará tu denuncia.');}
 catch(e){core.message(e.code==='23505'?'Ya has denunciado este anuncio.':e.message)}
 finally{btn.disabled=false}
}
async function moderationQuery(){
 let q=db.from('posts').select('*',{count:'exact'}).order('created_at',{ascending:false});
 if(modFilter==='new')q=q.eq('status','approved').is('reviewed_at',null);
 if(modFilter==='hidden')q=q.eq('status','rejected');
 if(modFilter==='reviewed')q=q.not('reviewed_at','is',null);
 if(modFilter==='reported'){
  const rr=await db.from('post_reports').select('post_id');
  if(rr.error)throw rr.error;
  modReports={};for(const x of rr.data||[])modReports[x.post_id]=(modReports[x.post_id]||0)+1;
  const ids=Object.keys(modReports);
  if(!ids.length)return {data:[],count:0};
  q=q.in('id',ids);
 }
 return q.range(modPage*12,modPage*12+11);
}
async function renderModeration(){
 const box=$('moderationPanel');if(!box||!core.admin)return;
 const token=++modToken;
 box.innerHTML='<div class="v5-admin-head"><span>🛡️</span><div><h3>Centro de moderación</h3><p>Los anuncios se publican al momento. Revisa, mantén o retira.</p></div></div>'+
 '<div class="v5-admin-tabs">'+[['new','Sin revisar'],['reported','Denunciados'],['hidden','Retirados'],['reviewed','Revisados'],['all','Todos']].map(([id,name])=>'<button type="button" class="'+(modFilter===id?'active':'')+'" data-v5-filter="'+id+'">'+name+'</button>').join('')+'</div><div id="v5ModList">Cargando anuncios...</div><div id="v5ModPager"></div>';
 try{
   const {data,error,count}=await moderationQuery();if(token!==modToken)return;if(error)throw error;
   modCache=data||[];
   const list=$('v5ModList');if(!list)return;
   list.innerHTML=modCache.length?modCache.map(p=>{const im=figure(p);return '<button class="v5-mod-row" data-v5-open="'+esc(p.id)+'"><span class="v5-mod-pic">'+(im?'<img src="'+safeUrl(im)+'" alt="">':(cats[p.category]?.icon||'📣'))+'</span><span class="v5-mod-text"><b>'+esc(p.title)+'</b><small>'+esc(p.category)+' · '+esc(p.seller_name)+'</small><small>'+(!p.reviewed_at?'🟠 Sin revisar':p.status==='rejected'?'⛔ Retirado':'✅ Revisado')+(modReports[p.id]?' · ⚑ '+modReports[p.id]+' denuncias':'')+'</small></span><span class="v5-row-arrow">›</span></button>'}).join(''):'<div class="v5-empty-ok">✅ No hay anuncios en esta categoría</div>';
   const pager=$('v5ModPager');pager.innerHTML='<div class="v5-pager"><span>'+Math.min(modPage*12+modCache.length,count||0)+' de '+(count||0)+'</span><button data-v5-page="prev" '+(modPage===0?'disabled':'')+'>‹ Anterior</button><button data-v5-page="next" '+(modPage*12+12>=(count||0)?'disabled':'')+'>Siguiente ›</button></div>';
 }catch(e){const l=$('v5ModList');if(l)l.textContent='No se pudo cargar: '+e.message;}
}
async function moderatePost(id,decision){
 if(!core.admin)return;
 const msgText=decision==='rejected'?'¿Retirar este anuncio de la comunidad? Dejará de ser público.':'¿Mantener este anuncio visible y marcarlo como revisado?';
 if(!confirm(msgText))return;
 const {error}=await db.rpc('moderate_post',{p_id:id,p_status:decision});
 if(error)return core.message(error.message);
 core.modal('detailModal',false);core.message(decision==='rejected'?'Anuncio retirado. Ya no es público.':'Anuncio mantenido y revisado.');
 await core.fetchPosts();await renderModeration();
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button,[data-v5-open]');if(!b)return;
 if(b.dataset.v5Cat){$('postCategory').value=b.dataset.v5Cat;editingDetails={};paintTypeFields();return}
 if(b.dataset.v5Filter){modFilter=b.dataset.v5Filter;modPage=0;renderModeration();return}
 if(b.dataset.v5Page){modPage+=b.dataset.v5Page==='next'?1:-1;modPage=Math.max(0,modPage);renderModeration();return}
 if(b.dataset.v5Open){const p=modCache.find(x=>x.id===b.dataset.v5Open)||core.posts.find(x=>x.id===b.dataset.v5Open);if(p)core.detail(p);return}
 if(b.dataset.v5Moderate){moderatePost(b.dataset.v5Id,b.dataset.v5Moderate);return}
 if(b.dataset.v5Report){if(!core.user){core.message('Inicia sesión para enviar una denuncia.');core.openAuth();return}reportPost=b.dataset.v5Report;$('v5ReportForm').reset();core.modal('v5ReportModal');return}
 if(b.dataset.v5Photo!==undefined){photoActive=Number(b.dataset.v5Photo);const p=core.selected,images=(p?.images||[]).filter(safeUrl);if(images[photoActive]){const im=$('v5DetailMain');if(im)im.src=images[photoActive];document.querySelectorAll('[data-v5-photo]').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.v5Photo)===photoActive))}return}
});
$('postCategory').addEventListener('change',()=>{editingDetails={};paintTypeFields()});
document.addEventListener('keydown',e=>{const el=e.target.closest?.('[data-view][role="button"]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();el.click()}});
passwordToggle();addReportModal();
window.LATINOS_V5={onEditorOpen,readDetails,cardHtml,detailHtml,renderModeration};
if(core.user&&core.admin)renderModeration();
