import{c as g,j as s}from"./index-D_IdTjbh.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=g("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),h={primary:"text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]",secondary:"border bg-transparent hover:bg-gray-50 active:scale-[0.98]",ghost:"border-0 bg-transparent hover:bg-gray-100 active:scale-[0.98]",danger:"text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]"},b={sm:"px-3 py-1.5 text-xs gap-1.5",md:"px-4 py-2 text-sm gap-2",lg:"px-6 py-3 text-base gap-2.5"},x=e=>{switch(e){case"primary":return{background:"linear-gradient(135deg, #4F46E5, #7C3AED)"};case"secondary":return{backgroundColor:"#FFFFFF",borderColor:"#E5E7EB"};case"ghost":return{};case"danger":return{backgroundColor:"#EF4444"};default:return{}}},f=({variant:e="primary",size:t="md",icon:r,iconPosition:o="left",fullWidth:l,loading:a=!1,disabled:c,children:d,className:i="",style:u,...p})=>{const n=c||a;return s.jsxs("button",{disabled:n,className:`
        inline-flex items-center justify-center font-medium
        rounded-[10px] transition-all duration-200 cursor-pointer
        select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${h[e]}
        ${b[t]}
        ${l?"w-full":""}
        ${n?"opacity-50 cursor-not-allowed pointer-events-none":""}
        ${i}
      `,style:{...x(e),...e==="secondary"?{border:"1px solid #E5E7EB",color:"#1F2937"}:{},...u},...p,children:[a?s.jsx(m,{size:t==="sm"?14:t==="lg"?20:16,className:"animate-spin"}):r&&o==="left"?s.jsx("span",{className:"shrink-0",children:r}):null,d,!a&&r&&o==="right"?s.jsx("span",{className:"shrink-0",children:r}):null]})};export{f as B};
