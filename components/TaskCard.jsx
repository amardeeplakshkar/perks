"use client";
import React, { useEffect } from "react";

const TaskCard = ({ taskname = "Cocks Task", amount, tasklink, bg, icon: Icon, scheme }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const links = document.querySelectorAll("[data-href]");

      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("data-href");
          if (href) {
            window.open(href, "_self");
          }
        });
      });

      return () => {
        links.forEach((link) => {
          link.removeEventListener("click", () => {});
        });
      };
    }
  }, []);

  return (
    <div className={`card flex justify-between items-center w-full p-1 rounded-lg m-1 ${bg}`}>
      <div className="flex justify-center items-center gap-2">
        <span className="h-[3rem] text-black font-bold aspect-square flex justify-center items-center rounded-full uppercase">
          <Icon color={scheme} />
        </span>
        <div>
          <h4 className="text-sm font-bold">{taskname}</h4>
          {amount !== undefined && (
            <h4 className="text-white/70 text-sm font-bold">{`+${amount} COCKS`}</h4>
          )}
        </div>
      </div>
      <div className="font-bold text-xs cursor-pointer bg-white rounded-3xl px-3 py-2 text-black" data-href={tasklink}>
        Start
      </div>
    </div>
  );
};

export default TaskCard;
