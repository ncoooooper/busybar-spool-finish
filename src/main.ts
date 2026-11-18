import {worksheet} from "@shared/worksheet";
import {calculate} from "./calculate";

const fields=[
  {
    "name": "Gross spool",
    "unit": "g",
    "initial": 223,
    "min": 0,
    "max": 5000,
    "step": 1
  },
  {
    "name": "Empty tare",
    "unit": "g",
    "initial": 160,
    "min": 0,
    "max": 2000,
    "step": 1
  },
  {
    "name": "Print use",
    "unit": "g",
    "initial": 58,
    "min": 0,
    "max": 5000,
    "step": 1
  },
  {
    "name": "Purge",
    "unit": "g",
    "initial": 8,
    "min": 0,
    "max": 500,
    "step": 1
  }
];
worksheet({name:"Spool Finish",fields,calculate,accent:"#B695F0",motion:{"motif":"shuttle","color":"#B695F0","shine":"#F8E8FF"}});
