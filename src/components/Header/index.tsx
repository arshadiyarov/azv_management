"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useButtonContext } from "@/ButtonContext";
import { exitAuthentication } from "@/AuthUtil";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const {
    setIsWholesaleActive,
    setIsRetailActive,
    isWholesaleActive,
    isRetailActive,
    setIsNavActive,
  } = useButtonContext();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/me/`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        });
        localStorage.setItem("username", res.data.username);
      } catch (err) {
        console.log("Error fetching user/me:", err);
        throw err;
      }
    };

    getUser();
  }, []);

  return (
    <header
      className={
        "relative lg:static bg-white px-5 py-[11px] border-b border-border flex w-full flex-col lg:flex-row items-center justify-between gap-3"
      }
    >
      <div className={"self-start lg:self-center flex items-center gap-3"}>
        <button
          className={"lg:hidden text-xl"}
          onClick={() => setIsNavActive(true)}
        >
          <GiHamburgerMenu />
        </button>
        Здравствуйте, {localStorage.username}
      </div>
      <div className={"flex lg:flex-row items-center gap-4"}>
        <button
          className={
            "py-2 px-6 border border-gray-500 rounded-md text-sm flex items-center w-fit h-fit hover:bg-gray-50 active:bg-gray-100"
          }
          onClick={() => {
            setIsWholesaleActive(!isWholesaleActive);
            setIsRetailActive(false);
          }}
        >
          Оптовая продажа
        </button>
        <button
          className={
            "py-2 px-6 border border-gray-500 rounded-md text-sm flex items-center w-fit h-fit hover:bg-gray-50 active:bg-gray-100"
          }
          onClick={() => {
            setIsRetailActive(!isRetailActive);
            setIsWholesaleActive(false);
          }}
        >
          Розничная продажа
        </button>
      </div>
      <Link
        href={"/login"}
        onClick={exitAuthentication}
        className={`absolute top-2 right-2 lg:static self-end text-white bg-primary border border-primary py-1 px-3 lg:py-2 lg:px-6 rounded-md text-sm flex items-center w-fit h-fit hover:bg-btnHover active:bg-btnActive`}
      >
        Выйти
      </Link>
    </header>
  );
};

export default Header;
