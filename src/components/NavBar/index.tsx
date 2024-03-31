"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavBarProps } from "@/components/NavBar/NavBarProps";

import { HiTable } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { useButtonContext } from "@/ButtonContext";
import { RxCross1 } from "react-icons/rx";

const NavBar: React.FC<NavBarProps> = ({ styles }) => {
  const { setIsNavActive } = useButtonContext();
  const pathname = usePathname();

  return (
    <aside
      className={`top-0 left-0 z-10 lg:static lg:block w-[320px] min-h-full lg:min-h-screen border-r border-border bg-white ${styles}`}
    >
      <div className={"sticky top-0 left-0 lg:static h-full"}>
        <h1
          className={
            "flex justify-between items-center px-5 py-4 text-xl font-bold border-b border-border"
          }
        >
          <button
            className={"block lg:hidden"}
            onClick={() => setIsNavActive(false)}
          >
            <RxCross1 />
          </button>
          <Link href={"/"} onClick={() => setIsNavActive(false)}>
            Azv Management
          </Link>
        </h1>
        <nav
          className={
            "px-3 pt-6 flex flex-col text-sm gap-1 lg:sticky left-0 top-0"
          }
        >
          <Link
            href={"/"}
            onClick={() => setIsNavActive(false)}
            className={`rounded-lg p-2 flex items-center gap-2 font-medium ${pathname === "/" ? "text-white bg-primary" : "hover:bg-secondary"}`}
          >
            <HiTable className={"text-xl"} />
            Таблица товаров
          </Link>
          <Link
            href={"/history"}
            onClick={() => setIsNavActive(false)}
            className={`rounded-lg p-2 flex items-center gap-2 font-medium ${pathname === "/history" ? "text-white bg-primary" : "hover:bg-secondary"}`}
          >
            <MdHistory className={"text-xl"} />
            История действий
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default NavBar;
