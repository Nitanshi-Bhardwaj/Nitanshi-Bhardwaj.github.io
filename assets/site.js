
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

  let hw=0,hh=0,hdpr=1,atoms=[];
  const TAU=Math.PI*2;

  function makeAtom(){
    const speed=.35+Math.random()*.65;
    const angle=Math.random()*TAU;
    return {
      x:Math.random()*hw,
      y:Math.random()*hh,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      speed,
      r:.8+Math.random()*1.7,
      glow:5+Math.random()*8,
      alpha:.35+Math.random()*.45,
      phase:Math.random()*TAU,
      turn:(Math.random()-.5)*.018,
      wander:Math.random()*TAU,
      wanderRate:.008+Math.random()*.02
    };
  }

  function resizeHeroDots(){
    hdpr=Math.min(window.devicePixelRatio||1,2);
    hw=hero.clientWidth;
    hh=hero.clientHeight;
    heroCanvas.width=Math.floor(hw*hdpr);
    heroCanvas.height=Math.floor(hh*hdpr);
    heroCanvas.style.width=hw+'px';
    heroCanvas.style.height=hh+'px';
    hctx.setTransform(hdpr,0,0,hdpr,0,0);

    const count=Math.max(34,Math.floor(hw/28));
    atoms=Array.from({length:count},makeAtom);
  }

  function drawHeroDots(){
    hctx.clearRect(0,0,hw,hh);

    for(let i=0;i<atoms.length;i++){
      const a=atoms[i];

      a.phase+=.035;
      a.wander+=a.wanderRate;

      // Curved Brownian style steering so particles roam instead of drifting straight.
      const steerX=Math.cos(a.wander)*.022;
      const steerY=Math.sin(a.wander*1.17)*.022;
      a.vx+=steerX;
      a.vy+=steerY;

      // Slowly rotate velocity to create orbit-like paths.
      const ca=Math.cos(a.turn),sa=Math.sin(a.turn);
      const nvx=a.vx*ca-a.vy*sa;
      const nvy=a.vx*sa+a.vy*ca;
      a.vx=nvx;
      a.vy=nvy;

      // Keep each atom near its preferred speed.
      const current=Math.hypot(a.vx,a.vy)||1;
      a.vx=(a.vx/current)*a.speed;
      a.vy=(a.vy/current)*a.speed;

      a.x+=a.vx;
      a.y+=a.vy;

      // Soft bounce keeps motion visible inside the banner.
      if(a.x<8){a.x=8;a.vx=Math.abs(a.vx);a.turn*=-1}
      if(a.x>hw-8){a.x=hw-8;a.vx=-Math.abs(a.vx);a.turn*=-1}
      if(a.y<8){a.y=8;a.vy=Math.abs(a.vy);a.turn*=-1}
      if(a.y>hh-8){a.y=hh-8;a.vy=-Math.abs(a.vy);a.turn*=-1}

      // Very faint short trails between nearby atoms.
      for(let j=i+1;j<atoms.length;j++){
        const b=atoms[j];
        const dx=a.x-b.x,dy=a.y-b.y;
        const d=Math.hypot(dx,dy);
        if(d<78){
          const la=(1-d/78)*.045;
          hctx.strokeStyle='rgba(69,215,255,'+la+')';
          hctx.lineWidth=.45;
          hctx.beginPath();
          hctx.moveTo(a.x,a.y);
          hctx.lineTo(b.x,b.y);
          hctx.stroke();
        }
      }

      const pulse=.65+.35*Math.sin(a.phase);
      const alpha=a.alpha*pulse;
      const g=hctx.createRadialGradient(a.x,a.y,0,a.x,a.y,a.glow);
      g.addColorStop(0,'rgba(226,252,255,'+Math.min(.95,alpha+.25)+')');
      g.addColorStop(.22,'rgba(126,232,255,'+alpha+')');
      g.addColorStop(.55,'rgba(69,215,255,'+(alpha*.28)+')');
      g.addColorStop(1,'rgba(69,215,255,0)');
      hctx.fillStyle=g;
      hctx.beginPath();
      hctx.arc(a.x,a.y,a.glow,0,TAU);
      hctx.fill();

      hctx.fillStyle='rgba(238,253,255,'+Math.min(.96,alpha+.32)+')';
      hctx.beginPath();
      hctx.arc(a.x,a.y,a.r,0,TAU);
      hctx.fill();
    }

    requestAnimationFrame(drawHeroDots);
  }

  window.addEventListener('resize',resizeHeroDots);
  resizeHeroDots();
  drawHeroDots();
}
