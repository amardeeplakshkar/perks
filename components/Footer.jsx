"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "../constants";

const Footer = () => {
  const pathname = usePathname();
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
  <footer className="bg-black w-full flex justify-between items-center py-1 px-2 rounded-xl">
      {ROUTES.map((route) => (
        <div
          key={route.href}
          data-href={route.href}
          className={`p-2 gap-1 flex flex-col items-center justify-center cursor-pointer ${
            pathname === route.href ? "text-white" : "text-zinc-600"
          }`}
        >
          <route.icon />
          <p className="text-xs">{route.label}</p>
        </div>
      ))}
    </footer>
  );
};

export default Footer;
