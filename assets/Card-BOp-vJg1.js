import{j as n}from"./index-CMTZ58j8.js";const x={none:"",sm:"p-3",md:"p-5",lg:"p-6"},m=({padding:e="md",hoverable:t=!1,onClick:o,children:a,className:d="",style:r,...p})=>n.jsx("div",{onClick:o,className:`
        bg-white rounded-[16px] shadow-sm
        ${x[e]}
        ${t||o?"cursor-pointer transition-shadow duration-200 hover:shadow-md active:scale-[0.99]":""}
        ${d}
      `,style:{boxShadow:"0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",...r},role:o?"button":void 0,tabIndex:o?0:void 0,onKeyDown:o?s=>{(s.key==="Enter"||s.key===" ")&&o()}:void 0,...p,children:a});export{m as C};
