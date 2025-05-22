import React from "react";

function Icons({icon}) {
  return (
    <span className="bg-white mr-2 rounded-full w-8 h-8 p-1 flex items-center justify-center hover:bg-green-500 ">
      <i className={`${icon}  text-slate-900 text-2xl hover:text-white`}></i>
    </span>
  );
}

export default Icons;
