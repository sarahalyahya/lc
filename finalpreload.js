//---------SHADER CODE---------///
setFunction({
  name: 'glowCircle',
  type: 'src',
  inputs: [{
      type: 'float',
      name: 'locX',
      default: 0.,
    },
    {
      type: 'float',
      name: 'locY',
      default: 0.,
    },
    {
      type: 'float',
      name: 'glowAmount',
      default: 50.,
    },
    {
      type: 'float',
      name: 'r',
      default: 0.6,
    },
    {
      type: 'float',
      name: 'g',
      default: 0.3,
    },
    {
      type: 'float',
      name: 'b',
      default: 0.5,
    },
  ],
  glsl: `
  vec2 loc = vec2(locX,locY);
  // loc is in screen spaces, but _st is in normalized space
  float dist = glowAmount/distance(_st*resolution, loc);
  return vec4(r*dist,g*dist,b*dist,1.);
`
})
//---------P1 SETUP---------///
resetSketch = (rm, hidden) =>
{
  if(rm){p1.remove();}
  p1 = new P5({width: window.innerWidth, height:window.innerHeight})
  s0.init({src: p1.canvas})
  if(hidden){p1.hide();}
}
resetSketch(false, true);
//---------P1 PARAMETERS---------///
xoff = 0;
yoff = 0;
p1.rectMode(p1.CENTER)
angle = [0, 0, 0];
angle2 = [0, 0, 0];
inc = p1.PI/120
xoff = 0;
yoff = 0.2;
r= 100;
revolution = 3;
r1 = 100;
mode = 0;
color = 0;
bump = 0;
ccprv = 0;
//---------P1 FUNCTIONS---------///
our_name_is = (str) =>
{
  p1.textSize(100);
  disp = 5;
  disp2 = 150;
  disp3 = 155;
  p1.fill(0,255,0,55);
  p1.text(str, p1.width/2-disp2+p1.random(-disp,disp), p1.height/2+disp3);
  p1.fill(255,0,0,55);
  p1.text(str, p1.width/2-disp2+p1.random(-disp,disp), p1.height/2+disp3);
  p1.fill(0,0,255,55);
  p1.text(str, p1.width/2-disp2+p1.random(-disp,disp), p1.height/2+disp3);
  p1.fill(255);
  p1.text(str, p1.width/2-disp2, p1.height/2+disp3-5);
}
tissue = () =>
{
  p1.colorMode(p1.RGB);
  p1.noFill();
  p1.stroke(255, 0.1);
  xoff += 0.02;
  yoff = xoff;
  for (let i = 0; i < 10; i++)
  {
    p1.push();
    _x = p1.noise(xoff)*p1.width;
    _y = p1.noise(2*yoff)*p1.height;
    _r = p1.random(3);
    _hyp = p1.sqrt(p1.pow(width/2, 2) + p1.pow(height/2, 2));
    _d = p1.map(p1.dist(_x, _y, p1.width/2, p1.height/2), 0, _hyp, 0.05, 1);
    //only first shape gets bold on drums
    if(i == 0 && p1.frameCount%10==0)
    {
      _s = 50 + 10*ccActual[4] + 50*ccActual[1];
      p1.stroke(255, ccActual[4]/4 + 10*_d);
    }
    else
    {
      _s = 50;
      p1.strokeWeight(1);
      p1.stroke(255, 10*_d);
    }
    //circle
    if (_r < 1)
      p1.rect(_x, _y, _s, _s);
    //square
    else if(_r < 2)
      p1.circle(_x, _y, _s);
    //triangle
    else
    {
      _angle = p1.random(0, 2*p1.PI);
      _angle2 = p1.random(0, 2*p1.PI);
      _angle3 = p1.random(0, 2*p1.PI);
      p1.triangle(_x+_s*p1.cos(_angle), _y+_s*p1.sin(_angle), _x+_s*p1.cos(_angle2), _y+_s*p1.sin(_angle2), _x+_s*p1.cos(_angle3), _y+_s*p1.sin(_angle3))
    }
    p1.pop();
    yoff += 0.05;
  }
}
spinners = (style, opacity, size, dirsign) =>
{
  //if cc is different from previous
  if (ccprv != ccActual[4])
  {
    bump = ccActual[4];
    ccprv = ccActual[4];
  }
  p1.colorMode(p1.HSB);
  p1.noFill();
  p1.rectMode(p1.CENTER);
  //p1.background(refresh);
  if (style == "color"){p1.stroke((color%360), 100 - p1.random(10), 100 - p1.random(10), opacity);}
  else if(style == "grayscale"){p1.stroke(360, opacity);}
  //for loop
  for(let i = 0; i < revolution; i++)
  {
    r1 = r + 100*i;
    dir = (i%2)*2 - 1;
    p1.push();
    //n = p1.noise(xoff);
    x = p1.cos(dir*angle[i])*r1 + p1.width/2;//p1.cos(dir*angle)*r1
    y = p1.sin(dir*angle[i])*r1 + p1.height/2;//p1.sin(dir*angle)*r1
    p1.translate(x , y);
    p1.rotate((angle2[i]+i*p1.PI/3)*dir);
    p1.square(0, 0, size);
    p1.pop();
    //if(p1.frameCount%4==0){p1.line(p1.width/2, p1.height/2, x, y);}
  }
  //if(p1.cos(angle)>0.99999 && revolution < 2){revolution+=1}
  //increment
  for(let i = 0; i < revolution; i ++)
  {
    angle[i] += 0.03*dirsign;
  	angle2[i] += (0.15+0.03*i)*dirsign;
  }
  color += 0.5;
}
//------HYDRA FUNCTIONS--------//
noteLine = () =>{
  return (
    shape(4, 1, ()=> 1 + 0.2*Math.sin(10.04*time/2))
      .scale(()=>0.001, 10, 200).scrollY(0.69)
      .scrollX(()=> 1 + 0.7*cc[2] + 0.3*cc[5])
  )
}
noteLineThin = () =>{
  return (
    shape(2, 0.1, ()=> 1 + 0.5*Math.sin(10.04*time))
      .scale(()=>0.01, 1, 5)
      .scrollY(()=> 1 + 0.7*cc[2]).rotate(p1.PI/2)
  )
}
noteXThin = () =>{
  return (
    shape(2, 0.1, ()=> 1 + 0.5*Math.sin(10.04*time))
      .scale(()=>0.01, 0.1, 0.1)
      .scrollY(()=> 1 + 0.7*cc[2]).rotate(p1.PI/2)
  )
}
noiseCanv = () =>
{
  return(
    noise(1000,10).thresh(0.9,1).add(noteXThin().modulate(osc()).repeat().scrollX(()=>time/4),0.5)
    )
}
noteGlitch = () =>{
  return (
    shape(2, 0.1)
      .scale(0.02)
    	.modulate(noise(()=>4*cc[1], ()=>100*cc[1]), 0.1)
  )
}
noteBar= () =>{
  return (
    shape(2, 0.01, ()=> 1 + 0.5*cc[1]*Math.sin(10.04*time))
      .scale(()=>0.01+0.02*cc[5] + 0.03*cc[0], 10, 50)
      .scrollY(()=> 1 + 0.7*cc[2] + 0.3*cc[5])
  )
}
glitchText = () =>{
  return (
    src(s0).modulate(voronoi(()=>cc[1]*20, ()=>cc[1]*20)).diff(noteGlitch()).modulateScale(noise(()=>cc[4],()=>cc[4]*0.1), ()=> 0.5+cc[4]*5)
  )
}
blueSun = () =>{
  glowCircle(() => flashx, () => flashy, ()=>20+ccActual[0]*20+ccActual[2]*2, 0.15, 0.1, .08).out(o1);
  return (
    noiseCanv().invert().diff(src(o1)).blend(o0,0.9)
  )
}
redSun = () => {
  glowCircle(() => flashx, () => flashy, ()=>20+ccActual[0]*20+ccActual[2]*2, 0.15, 0.1, .08).out(o1);
  return(
    src(o1).diff(noiseCanv(),0.1).diff(o0).blend(o0, 0.9)
    )
}
piano1 = () =>
{
  src(s0).add(noteLine(),0.5).blend(o0,0.92)
}
piano2 = () =>
{
  src(s0).add(noteLineThin()).blend(o0,0.92)
}
piano3 = () =>
{
  src(s0).add(noteLineThin()).add(noteLine(), 0.92).blend(o0,0.95)
}
