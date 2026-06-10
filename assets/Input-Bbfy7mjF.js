import{r as g,j as s}from"./index-BAIgxJKF.js";const f=g.forwardRef(({label:e,error:r,prefixIcon:t,suffixIcon:o,multiline:m=!1,onChange:a,className:x="",style:c,id:p,...n},d)=>{const l=p||`input-${e==null?void 0:e.replace(/\s+/g,"-")}`,i=`
      w-full rounded-[10px] border px-3 py-2.5 text-sm font-normal
      transition-colors duration-200 outline-none
      placeholder:text-gray-400
      focus:ring-2 focus:ring-offset-0
      ${r?"border-red-400 focus:border-red-500 focus:ring-red-500/20":"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"}
      ${t?"pl-10":""}
      ${o?"pr-10":""}
      ${x}
    `,u=F=>{a==null||a(F.target.value)};return s.jsxs("div",{className:"flex flex-col gap-1.5",children:[e&&s.jsx("label",{htmlFor:l,className:"text-sm font-medium",style:{color:"#1F2937"},children:e}),s.jsxs("div",{className:"relative flex items-center",children:[t&&s.jsx("span",{className:"absolute left-3 z-10",style:{color:"#6B7280"},children:t}),m?s.jsx("textarea",{ref:d,id:l,rows:4,className:`${i} resize-y min-h-[100px]`,style:{backgroundColor:"#FFFFFF",color:"#1F2937",...c},onChange:u,...n}):s.jsx("input",{ref:d,id:l,className:i,style:{backgroundColor:"#FFFFFF",color:"#1F2937",...c},onChange:u,...n}),o&&s.jsx("span",{className:"absolute right-3 z-10",style:{color:"#6B7280"},children:o})]}),r&&s.jsx("p",{className:"text-xs mt-0.5",style:{color:"#EF4444"},children:r})]})});f.displayName="Input";export{f as I};
