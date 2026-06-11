import{j as o}from"./index-CoE8DJen.js";const a=({checked:s,onChange:i,disabled:r=!1,label:t,id:e})=>{const n=e||`toggle-${t==null?void 0:t.replace(/\s+/g,"-")}`;return o.jsxs("label",{htmlFor:n,className:`inline-flex items-center gap-2.5 cursor-pointer select-none ${r?"opacity-50 cursor-not-allowed":""}`,children:[o.jsx("button",{type:"button",role:"switch","aria-checked":s,id:n,disabled:r,onClick:()=>!r&&(i==null?void 0:i(!s)),className:`
          relative inline-flex h-6 w-11 shrink-0 rounded-full
          transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${s?"":"bg-gray-300"}
        `,style:{backgroundColor:s?"#4F46E5":void 0},children:o.jsx("span",{className:`
            inline-block h-5 w-5 rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out mt-0.5 ml-0.5
            ${s?"translate-x-5":"translate-x-0"}
          `})}),t&&o.jsx("span",{className:"text-sm font-medium",style:{color:"#1F2937"},children:t})]})};export{a as T};
