// Unit-square packings. Sources and provenance are documented in README.md.
export const sides = {5:2+Math.SQRT1_2,10:3+Math.SQRT1_2,17:4.67553009360455095};
const square=[[0,0],[1,0],[1,1],[0,1]];
const rad=a=>a*Math.PI/180;
const transform=(p,a=0,x=0,y=0)=>p.map(([u,v])=>[u*Math.cos(rad(a))-v*Math.sin(rad(a))+x,u*Math.sin(rad(a))+v*Math.cos(rad(a))+y]);
const at=(x,y)=>transform(square,0,x,y);
export function packing(n){
  const s=sides[n];let p=[];
  if(n===5)p=[at(0,0),at(s-1,0),at(0,s-1),at(s-1,s-1),transform(at(0,-.5),45,1,1)];
  if(n===10){const corner=[at(0,0),at(1,0),at(0,1),at(s-1,0)];p=[...corner,...corner.map(q=>transform(q,180,s,s)),...[-1,0].map(dy=>transform(at(0,dy),45,1.5,1.5))];}
  if(n===17){
    const side=[at(0,0),at(1,0),at(0,1),at(0,s-1)],a=39.80495897976779506,v=.056838696870287318,u=.276426766820379851,w=.404478693276882795,x=1.847324826510285097;
    p=[...side,...side.map(q=>q.map(([x,y])=>[s-x,y]).reverse()),...[[0,0],[1,v],[u,-1],[u+1,-1+v],[w,-2],[w+1,-2+v]].map(([dx,dy])=>transform(at(dx,dy),a,.640176192429266088,2)),at(x,s-1),transform(at(0,-.505927428006637436),-36.62378638344658932,1+x,s-1),at(s-1,3.113460132512564046-1)];
  }
  if(p.length!==n)throw Error('Unsupported packing '+n);
  return p.map(q=>({x:q.reduce((t,v)=>t+v[0],0)/4,y:q.reduce((t,v)=>t+v[1],0)/4,angle:Math.atan2(q[1][1]-q[0][1],q[1][0]-q[0][0])*180/Math.PI,vertices:q}));
}
export function overlaps(a,b,tolerance=1e-8){
  for(const polygon of [a,b])for(let k=0;k<4;k++){
    const edge=[polygon[(k+1)%4][0]-polygon[k][0],polygon[(k+1)%4][1]-polygon[k][1]],length=Math.hypot(...edge),axis=[-edge[1]/length,edge[0]/length];
    const project=p=>p.map(v=>v[0]*axis[0]+v[1]*axis[1]);const A=project(a),B=project(b);
    if(Math.min(Math.max(...A),Math.max(...B))-Math.max(Math.min(...A),Math.min(...B))<=tolerance)return false;
  }return true;
}
