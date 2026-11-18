import {surface,wrap,persist,read,panel,label,rect,type Frame,type MotionOptions} from "./surface";

export type Parameter={name:string;unit:string;initial:number;min:number;max:number;step:number;digits?:number;choices?:string[]};
export type Result={name:string;value:string;detail:string[];fraction?:number};
export type Worksheet={name:string;fields:Parameter[];calculate:(values:number[])=>Result[];motion:MotionOptions;accent:string};
export function worksheet(def:Worksheet){
 const saved=read<number[]>("inputs",[]);
 let values=def.fields.map((f,i)=>Number.isFinite(saved[i])?Math.max(f.min,Math.min(f.max,saved[i])):f.initial);
 let field=0,page=0,editing=false,dirty=false,delay:ReturnType<typeof setTimeout>|undefined;
 function commit(){if(delay!==undefined)clearTimeout(delay);delay=undefined;if(dirty){persist("inputs",values);dirty=false;}}
 function schedule(){dirty=true;if(delay!==undefined)clearTimeout(delay);delay=setTimeout(commit,750);}
 function number(f:Parameter,value:number){return f.choices?f.choices[Math.round(value)]||"?":Number(value.toFixed(f.digits??2))+f.unit;}
 function draw():Frame{
   const results=def.calculate(values);page=Math.min(page,results.length-1);
   const r=results[page],f=def.fields[field],val=editing?number(f,values[field]):r.value;
   const title=editing?f.name:r.name;
   const frame:Frame=[label("kind",title.toUpperCase().slice(0,16),1,0,def.accent+"FF","front","tiny"),
     label("number",val.slice(0,18),1,6,"#F8F4DFFF","front","small")];
   if(r.fraction!==undefined&&!editing&&val.length<=8){
     const q=Math.max(0,Math.min(1,r.fraction));
     for(let i=0;i<6;i++)frame.push(rect("scale"+i,52+i*3,14-i,2,1+i,i<Math.round(q*6)?def.accent+"FF":"#333D45FF"));
   }
   return frame.concat(panel(def.name.toUpperCase(),editing?[f.name+": "+number(f,values[field]),
       "Range "+number(f,f.min)+" - "+number(f,f.max),"Wheel: adjust amount","Click: next input","Start: see result",
       "Input "+(field+1)+"/"+def.fields.length]:
      [r.name+": "+r.value,...r.detail.slice(0,2),"Wheel: results / Click: edit","Start: edit current inputs","Result "+(page+1)+"/"+results.length]));
 }
 const refresh=surface(draw,k=>{
   const f=def.fields[field];
   if(k==="up"||k==="down"){
     const dir=k==="up"?1:-1;
     if(editing){values[field]=Math.round(Math.max(f.min,Math.min(f.max,values[field]+dir*f.step))*10000)/10000;schedule();}
     else page=wrap(page+dir,def.calculate(values).length);
   }else if(k==="ok"){if(editing)field=wrap(field+1,def.fields.length);else editing=true;}
   else if(k==="start"){editing=!editing;if(!editing)commit();}
   else if(k==="hold-ok"&&editing){values[field]=f.initial;schedule();}
 },commit,{...def.motion,stateKey:()=>editing?"input"+field:"result"+page});
 return refresh;
}
