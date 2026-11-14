import * as THREE from 'three';
import {products,walls} from '../data/studio-products.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const vec=a=>new THREE.Vector3(...a);
const mat=(color,roughness=.55,metalness=.25,emissive=0x000000)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:0});
export function createShowroom(container,opts={}){
 const {onPick=()=>{},onHover=()=>{},onWall=()=>{}}=opts;
 const coarse=window.matchMedia?window.matchMedia('(pointer: coarse)').matches:false;
 let renderer;
 try { renderer=new THREE.WebGLRenderer({antialias:!coarse,alpha:false,powerPreference:'low-power'}); }
 catch(error){ container.classList.add('studio-webgl-unavailable'); onPick(null); return { enter(){},dispose(){},setLight(){},setAll(){},flyToWall(){} }; }
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1.15:1.5));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.enabled=!coarse;renderer.shadowMap.type=THREE.PCFShadowMap;container.appendChild(renderer.domElement);
 const el=renderer.domElement;el.style.touchAction='none';
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x090b10);scene.fog=new THREE.Fog(0x090b10,10,24);
 const camera=new THREE.PerspectiveCamera(55,1,.1,60);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({color:0x171a20,roughness:.32,metalness:.35}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(12,12),mat(0x11151c,.9));ceiling.rotation.x=Math.PI/2;ceiling.position.y=3.6;scene.add(ceiling);
 const wallMat=mat(0x20242d,.88,.08), sideMat=mat(0x171b23,.82,.1), trim=mat(0x987345,.35,.72);
 function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
 box(10,3.6,.22,wallMat,0,1.8,-4.8);box(10,3.6,.22,wallMat,0,1.8,4.8);box(.22,3.6,9.6,sideMat,-4.9,1.8,0);box(.22,3.6,9.6,sideMat,4.9,1.8,0);
 // Four architectural gallery bays and warm brass detailing.
 for(let x=-3.7;x<=3.71;x+=2.45){box(.025,3.2,.035,trim,x,1.8,-4.66);box(.025,3.2,.035,trim,x,1.8,4.66);}
 for(let z=-3.6;z<=3.61;z+=2.4){box(.035,3.2,.025,trim,-4.76,1.8,z);box(.035,3.2,.025,trim,4.76,1.8,z);}
 box(9.7,.035,.04,trim,0,3.43,-4.65);box(9.7,.035,.04,trim,0,3.43,4.65);
 // Subtle perimeter coves.
 const coveMat=new THREE.MeshBasicMaterial({color:0x9b7443});box(9.5,.025,.06,coveMat,0,3.48,-4.55);box(9.5,.025,.06,coveMat,0,3.48,4.55);
 scene.add(new THREE.HemisphereLight(0x8994aa,0x11131a,.38));
 const ambient=new THREE.AmbientLight(0x9aa6bd,.16);scene.add(ambient);
 const key=new THREE.DirectionalLight(0xc4d2e8,.32);key.position.set(1,6,4);key.castShadow=!coarse;scene.add(key);
 const fixtures=new Map(),pickables=[];
 const warm=0xffc77e;
 function fixture(p,index){
  const g=new THREE.Group();const metal=mat(0x9d7948,.28,.82),black=mat(0x15191f,.3,.7),glass= new THREE.MeshStandardMaterial({color:0xffe3b5,roughness:.18,metalness:.08,emissive:0xffbd70,emissiveIntensity:0});
  const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
  if(p.kind==='pendant'||p.kind==='globe'||p.kind==='chandelier'){
   add(new THREE.CylinderGeometry(.018,.018,.55,12),black,0,.27,0);
   if(p.kind==='pendant') {add(new THREE.CylinderGeometry(.07,.3,.24,32,1,true),metal,0,-.05,0);add(new THREE.SphereGeometry(.11,20,16),glass,0,-.16,0);}
   else if(p.kind==='globe'){add(new THREE.SphereGeometry(.24,32,24),glass,0,-.08,0);add(new THREE.TorusGeometry(.25,.018,8,36),metal,0,-.08,0);}
   else {add(new THREE.TorusGeometry(.43,.025,10,48),metal,0,-.04,0);for(let i=0;i<5;i++){let a=i*Math.PI*2/5;add(new THREE.SphereGeometry(.105,20,16),glass,Math.cos(a)*.36,-.08,Math.sin(a)*.36);}}
  } else if(p.kind==='sconce'||p.kind==='linear'){
   add(new THREE.BoxGeometry(.12,.5,.12),black,0,0,0);add(new THREE.BoxGeometry(.16,p.kind==='linear'?.65:.35,.11),glass,0,0,.1);add(new THREE.BoxGeometry(.2,.06,.14),metal,0,.29,.02);
  } else if(p.kind==='ceiling'||p.kind==='panel'){
   add(new THREE.BoxGeometry(p.kind==='panel'?.95:.65,.08,p.kind==='panel'?.48:.65),black,0,0,0);add(new THREE.BoxGeometry(p.kind==='panel'?.88:.57,.025,p.kind==='panel'?.41:.57),glass,0,-.05,0);
  } else if(p.kind==='bollard'){
   add(new THREE.CylinderGeometry(.11,.14,.85,24),black,0,-.18,0);add(new THREE.CylinderGeometry(.105,.105,.12,24),glass,0,.3,0);add(new THREE.CylinderGeometry(.16,.16,.04,24),metal,0,.37,0);
  } else {add(new THREE.BoxGeometry(.32,.55,.2),black,0,0,0);add(new THREE.BoxGeometry(.22,.4,.13),glass,0,0,.12);add(new THREE.CylinderGeometry(.04,.04,.2,12),metal,0,-.34,0);}
  g.position.set(...p.position);if(p.kind==='sconce'||p.kind==='linear'||p.kind==='ceiling'||p.kind==='panel'||p.kind==='lantern')g.rotation.y=Math.PI/2;
  scene.add(g);
  const glow=new THREE.PointLight(warm,0, p.kind==='bollard'?3.2:4.5,2);glow.position.set(p.position[0],p.position[1]-.12,p.position[2]+(p.position[2]>0?-.35:.35));scene.add(glow);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),new THREE.MeshBasicMaterial({color:0xffd39a,transparent:true,opacity:.0}));halo.position.set(p.position[0],p.position[1]-.3,p.position[2]+(p.position[2]>0?-.08:.08));scene.add(halo);
  g.traverse(o=>{if(o.isMesh){o.userData.pid=p.id;pickables.push(o);}});
  const ring=new THREE.Mesh(new THREE.RingGeometry(.105,.135,32),new THREE.MeshBasicMaterial({color:0xd5ad70,side:THREE.DoubleSide,transparent:true,opacity:.9}));ring.position.set(p.position[0],p.position[1]-.52,p.position[2]+(p.position[2]>0?-.04:.04));if(p.kind==='sconce'||p.kind==='linear'||p.kind==='ceiling'||p.kind==='panel'||p.kind==='lantern')ring.rotation.y=Math.PI/2;scene.add(ring);ring.userData.pid=p.id;pickables.push(ring);
  fixtures.set(p.id,{group:g,glow,halo,ring,materials:[]});g.traverse(o=>{if(o.isMesh&&o.material?.emissive)fixtures.get(p.id).materials.push(o.material);});
 }
 products.forEach(fixture);
 const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();function hitAt(x,y){const r=el.getBoundingClientRect();ndc.set((x-r.left)/r.width*2-1,-((y-r.top)/r.height*2-1));ray.setFromCamera(ndc,camera);return ray.intersectObjects(pickables,false)[0]?.object?.userData?.pid||null;}
 const cam={pos:vec([0,1.65,3.9]),look:vec([0,1.65,-4.2])};camera.position.copy(cam.pos);camera.lookAt(cam.look);
 let target=null,entered=false,drag=null,activeWall=0;
 function flyToWall(i){activeWall=(i+4)%4;const spots=[{p:[0,1.65,3.6],l:[0,1.7,-4.5]},{p:[3.55,1.65,0],l:[-4.6,1.7,0]},{p:[0,1.65,-3.6],l:[0,1.7,4.5]},{p:[-3.55,1.65,0],l:[4.6,1.7,0]}];const s=spots[activeWall];target={from:camera.position.clone(),look:cam.look.clone(),to:vec(s.p),toLook:vec(s.l),start:performance.now(),duration:1100};onWall(activeWall);}
 function flyToProduct(id){const p=products.find(x=>x.id===id);if(!p)return;const pos=vec(p.position);const normal=new THREE.Vector3(0,0,p.position[2]>0?-1:1);if(Math.abs(p.position[0])>3.8)normal.set(p.position[0]>0?-1:1,0,0);const to=pos.clone().addScaledVector(normal,2.35);to.y=Math.max(1.35,Math.min(2.15,pos.y));target={from:camera.position.clone(),look:cam.look.clone(),to,toLook:pos.clone(),start:performance.now(),duration:900};}
 let pointerMoved=0;
 const down=e=>{if(e.button!==undefined&&e.button!==0)return;drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY};pointerMoved=0;el.setPointerCapture?.(e.pointerId);};
 const move=e=>{if(drag){const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.lastX=e.clientX;drag.lastY=e.clientY;pointerMoved+=Math.abs(dx)+Math.abs(dy);if(pointerMoved>5){target=null;const offset=camera.position.clone().sub(cam.look);const spherical=new THREE.Spherical().setFromVector3(offset);spherical.theta-=dx*.004;spherical.phi=clamp(spherical.phi+dy*.003,.95,2.05);offset.setFromSpherical(spherical);camera.position.copy(cam.look.clone().add(offset));camera.lookAt(cam.look);}}else{const id=hitAt(e.clientX,e.clientY);el.style.cursor=id?'pointer':'grab';onHover(id?products.find(p=>p.id===id):null);}};
 const up=e=>{if(!drag)return;const moved=pointerMoved;drag=null;if(moved<8){const id=hitAt(e.clientX,e.clientY);if(id)onPick(id);}};
 const cancel=()=>drag=null;el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',cancel);
 const keys={};const kd=e=>{keys[e.key.toLowerCase()]=true;};const ku=e=>{keys[e.key.toLowerCase()]=false;};window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
 function resize(){const w=container.clientWidth||window.innerWidth,h=container.clientHeight||window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.8?68:55;camera.updateProjectionMatrix();}
 const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;if(ro)ro.observe(container);else window.addEventListener('resize',resize,{passive:true});resize();
 let raf=0,last=performance.now();function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(target){const k=clamp((now-target.start)/target.duration,0,1),e=1-Math.pow(1-k,3);camera.position.lerpVectors(target.from,target.to,e);cam.look.lerpVectors(target.look,target.toLook,e);camera.lookAt(cam.look);if(k>=1)target=null;}
  if(entered&&!target&&!drag){const forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),side=(keys.d?1:0)-(keys.a?1:0);if(forward||side){const dir=new THREE.Vector3();camera.getWorldDirection(dir);dir.y=0;dir.normalize();const right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0)).normalize();camera.position.addScaledVector(dir,forward*dt*2.1);camera.position.addScaledVector(right,side*dt*2.1);camera.position.x=clamp(camera.position.x,-3.8,3.8);camera.position.z=clamp(camera.position.z,-3.8,3.8);cam.look.copy(camera.position).add(dir);camera.lookAt(cam.look);}}
  fixtures.forEach((f,id)=>{f.ring.material.opacity=.62+Math.sin(now*.003+products.findIndex(p=>p.id===id))*.16;});renderer.render(scene,camera);raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);
 function setLight(id,on,brightness=1,temp=3000){const f=fixtures.get(id);if(!f)return;const color=temp<=2700?0xffb66d:temp<=3500?0xffd5a0:0xfff0d5;f.glow.color.setHex(color);f.glow.intensity=on?brightness*2.2:0;f.glow.distance=on?4.5+brightness*1.8:0;f.halo.material.opacity=on?.5:0;f.materials.forEach(m=>{m.emissive.setHex(color);m.emissiveIntensity=on?brightness*.85:0;});f.group.userData.on=on;}
 function setAll(on){products.forEach(p=>setLight(p.id,on));}
 function setWall(i){flyToWall(i);}
 function enter(){entered=true;flyToWall(0);}function dispose(){cancelAnimationFrame(raf);if(ro)ro.disconnect();else window.removeEventListener('resize',resize);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',cancel);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);renderer.dispose();container.removeChild(el);}
 return {enter,flyToWall:setWall,flyToProduct,setLight,setAll,dispose};
}
