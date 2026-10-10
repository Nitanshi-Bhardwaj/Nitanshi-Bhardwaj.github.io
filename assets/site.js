
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
