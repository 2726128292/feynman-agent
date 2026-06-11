import{r as p,j as e}from"./index-CoE8DJen.js";import{C as f}from"./chevron-down-DqUQQbxv.js";const g=p.forwardRef(({label:s,options:n,error:o,placeholder:l,onChange:t,className:c="",style:i,id:d,...u},m)=>{const a=d||`select-${s==null?void 0:s.replace(/\s+/g,"-")}`,x=r=>{t==null||t(r.target.value)};return e.jsxs("div",{className:"flex flex-col gap-1.5",children:[s&&e.jsx("label",{htmlFor:a,className:"text-sm font-medium",style:{color:"#1F2937"},children:s}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{ref:m,id:a,className:`
              w-full appearance-none rounded-[10px] border px-3 py-2.5 pr-9
              text-sm font-normal transition-colors duration-200
              outline-none cursor-pointer
              ${o?"border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20":"border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}
              ${c}
            `,style:{backgroundColor:"#FFFFFF",color:"#1F2937",...i},onChange:x,defaultValue:"",...u,children:[l&&e.jsx("option",{value:"",disabled:!0,children:l}),n.map(r=>e.jsx("option",{value:r.value,children:r.label},r.value))]}),e.jsx(f,{size:16,className:"absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",style:{color:"#6B7280"}})]}),o&&e.jsx("p",{className:"text-xs mt-0.5",style:{color:"#EF4444"},children:o})]})});g.displayName="Select";export{g as S};
