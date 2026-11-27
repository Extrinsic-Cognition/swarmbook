// Stable illustrated bodies shared by growth and governed memory.
// A new ballot changes a body's decision, never its ancestry or geometry rung.
export const ANATOMY_CHAMBERS=Object.freeze([
  {id:'p1-root',polisId:'p1',parent:null,chair:null,growthId:'root',rung:5},
  {id:'p1-a',polisId:'p1',parent:'p1-root',chair:9,growthId:'child-9',rung:2},
  {id:'p1-b',polisId:'p1',parent:'p1-root',chair:4,growthId:'child-4',rung:4},
  {id:'p1-c',polisId:'p1',parent:'p1-root',chair:5,growthId:'child-5',rung:1},
  {id:'p1-leaf',polisId:'p1',parent:'p1-a',chair:9,growthId:'leaf-9',rung:1},
  {id:'p1-leaf5',polisId:'p1',parent:'p1-a',chair:5,growthId:'leaf-5',rung:3},
  {id:'p2-root',polisId:'p2',parent:null,chair:null,growthId:null,rung:2},
  {id:'p2-a',polisId:'p2',parent:'p2-root',chair:9,growthId:null,rung:1},
  {id:'p2-b',polisId:'p2',parent:'p2-root',chair:4,growthId:null,rung:3},
  {id:'p3-root',polisId:'p3',parent:null,chair:null,growthId:null,rung:1},
  {id:'p3-a',polisId:'p3',parent:'p3-root',chair:9,growthId:null,rung:3},
  {id:'p3-b',polisId:'p3',parent:'p3-root',chair:4,growthId:null,rung:2},
].map(Object.freeze));
