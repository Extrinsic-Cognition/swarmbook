// Overlay the final face fans with the seed's twelve radial face regions.
// Every resulting vertex lies on both polyhedra. Shared edges therefore stay
// shared at every interpolation value; no cracks and no replacement shell.
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function clip(poly,n){
  const out=[];
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];
    const rawA=dot(a.p,n),rawB=dot(b.p,n),da=Math.abs(rawA)<1e-10?0:rawA,db=Math.abs(rawB)<1e-10?0:rawB;
    if(da>=0)out.push(a);
    if((da>=0)!==(db>=0)){
      const t=da/(da-db);
      out.push({p:a.p.map((x,j)=>x+t*(b.p[j]-x)),edge:a.edge+t*(b.edge-a.edge)});
    }
  }
  return out.filter((v,i)=>Math.hypot(...v.p.map((x,j)=>x-out[(i+out.length-1)%out.length].p[j]))>1e-10);
}
export function liquorEntryMesh(seed,target){
  const planes=seed.pents.map(f=>({n:f.normal,d:dot(f.normal,f.center)}));
  const vertices=[];
  const put=(v,plane,face,id)=>{
    const scale=plane.d/dot(plane.n,v.p),start=v.p.map(x=>x*scale);
    vertices.push(...start,...v.p,...plane.n,...face.normal,id,v.edge);
  };
  [...target.pents,...target.hexes].forEach((face,id)=>{
    for(let i=0;i<face.verts.length;i++){
      const triangle=[{p:face.center,edge:1},{p:face.verts[i],edge:0},{p:face.verts[(i+1)%face.verts.length],edge:0}];
      for(const plane of planes){
        let polygon=triangle;
        for(const other of planes){
          if(other===plane)continue;
          polygon=clip(polygon,plane.n.map((x,j)=>x/plane.d-other.n[j]/other.d));
          if(polygon.length<3)break;
        }
        for(let j=1;j<polygon.length-1;j++){
          const a=polygon[j].p.map((x,k)=>x-polygon[0].p[k]),b=polygon[j+1].p.map((x,k)=>x-polygon[0].p[k]);
          if(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])<1e-10)continue;
          for(const v of [polygon[0],polygon[j],polygon[j+1]])put(v,plane,face,id);
        }
      }
    }
  });
  return new Float32Array(vertices);
}
