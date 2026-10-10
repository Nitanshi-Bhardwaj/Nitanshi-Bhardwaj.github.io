
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    const el=document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

const canvas=document.createElement('canvas');
canvas.id='neural-canvas';
document.body.prepend(canvas);
const ctx=canvas.getContext('2d');
let nodes=[],w=0,h=0,dpr=1;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,2);
  w=window.innerWidth;
  h=window.innerHeight;
  canvas.width=Math.floor(w*dpr);
  canvas.height=Math.floor(h*dpr);
  canvas.style.width=w+'px';
  canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.max(22,Math.floor((w*h)/52000));
  nodes=Array.from({length:count},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    vx:(Math.random()-.5)*.12,
    vy:(Math.random()-.5)*.12,
    r:Math.random()*1.8+1.1,
    pulse:Math.random()*Math.PI*2
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<nodes.length;i++){
    const a=nodes[i];
    a.x+=a.vx;a.y+=a.vy;a.pulse+=.018;
    if(a.x<-30)a.x=w+30;if(a.x>w+30)a.x=-30;
    if(a.y<-30)a.y=h+30;if(a.y>h+30)a.y=-30;
    for(let j=i+1;j<nodes.length;j++){
      const b=nodes[j];
      const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<165){
        const alpha=(1-d/165)*.18;
        ctx.strokeStyle='rgba(69,215,255,'+alpha+')';
        ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    const glow=.48+.22*Math.sin(a.pulse);
    ctx.fillStyle='rgba(126,232,255,'+glow+')';
    ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(79,140,255,.16)';
    ctx.beginPath();ctx.arc(a.x,a.y,a.r+5+Math.sin(a.pulse)*2,0,Math.PI*2);ctx.stroke();
  }
  requestAnimationFrame(draw);
}
window.addEventListener('resize',resize);
resize();
draw();

const hero=document.querySelector('.hero');
if(hero){
  const heroCanvas=document.createElement('canvas');
  heroCanvas.id='hero-dots';
  hero.prepend(heroCanvas);
  const hctx=heroCanvas.getContext('2d');
  let hw=0,hh=0,hdpr=1,dots=[];

  function resizeHeroDots(){
    hdpr=Math.min(window.devicePixelRatio||1,2);
    hw=hero.clientWidth;
    hh=hero.clientHeight;
    heroCanvas.width=Math.floor(hw*hdpr);
    heroCanvas.height=Math.floor(hh*hdpr);
    heroCanvas.style.width=hw+'px';
    heroCanvas.style.height=hh+'px';
    hctx.setTransform(hdpr,0,0,hdpr,0,0);
    const count=Math.max(26,Math.floor(hw/35));
    dots=Array.from({length:count},()=>({
      x:Math.random()*hw,
      y:Math.random()*hh,
      vx:(Math.random()-.5)*.28,
      vy:(Math.random()-.5)*.18,
      r:Math.random()*1.8+.7,
      a:Math.random()*.5+.3,
      p:Math.random()*Math.PI*2
    }));
  }

  function drawHeroDots(){
    hctx.clearRect(0,0,hw,hh);
    for(const d of dots){
      d.x+=d.vx;
      d.y+=d.vy;
      d.p+=.025;
      if(d.x<-12)d.x=hw+12;
      if(d.x>hw+12)d.x=-12;
      if(d.y<-12)d.y=hh+12;
      if(d.y>hh+12)d.y=-12;
      const pulse=.55+.45*Math.sin(d.p);
      const alpha=Math.max(.15,d.a*pulse);
      const g=hctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*7);
      g.addColorStop(0,'rgba(126,232,255,'+alpha+')');
      g.addColorStop(.28,'rgba(69,215,255,'+(alpha*.55)+')');
      g.addColorStop(1,'rgba(69,215,255,0)');
      hctx.fillStyle=g;
      hctx.beginPath();
      hctx.arc(d.x,d.y,d.r*7,0,Math.PI*2);
      hctx.fill();
      hctx.fillStyle='rgba(220,250,255,'+Math.min(.9,alpha+.18)+')';
      hctx.beginPath();
      hctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      hctx.fill();
    }
    requestAnimationFrame(drawHeroDots);
  }

  window.addEventListener('resize',resizeHeroDots);
  resizeHeroDots();
  drawHeroDots();
}
