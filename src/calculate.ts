import type {Result} from "@shared/worksheet";

export function calculate(v:number[]):Result[]{
const [gross,tare,need,purge]=v,left=Math.max(0,gross-tare),margin=left-need-purge;return [
 {name:"Print margin",value:(margin>=0?"+":"")+margin+"g",detail:[margin>=0?"Enough filament":"Load another spool","Usable stock "+left+"g"],fraction:left/Math.max(1,need+purge)},
 {name:"Required",value:(need+purge)+"g",detail:["Part "+need+"g","Purge "+purge+"g"]}];
}
