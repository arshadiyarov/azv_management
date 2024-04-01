"use client";

import Header from "@/components/Header";
import History from "@/components/HistoryPage";
import { useButtonContext } from "@/ButtonContext";
import RetailModule from "@/components/RetailModule";
import React from "react";
import WholeSaleModule from "@/components/WholeSaleModule";
import AddItemModule from "@/components/AddItemModule";
import NavBar from "@/components/NavBar";

const HistoryPage = () => {
  const { isWholesaleActive, isRetailActive, isAddItemActive, isNavActive } =
    useButtonContext();

  return (
    <>
      <NavBar styles={`${isNavActive ? "absolute" : "hidden"}`} />
      <div
        className={`w-full relative ${isRetailActive || isWholesaleActive || isAddItemActive ? "h-screen overflow-hidden" : ""}`}
      >
        <Header />
        <History />
        {isRetailActive && (
          <div className={"absolute top-0 left-0 lg:top-0 lg:-left-[130px]"}>
            <RetailModule />
          </div>
        )}
        {isWholesaleActive && (
          <div className={"absolute top-0 left-0 lg:top-0 lg:-left-[130px]"}>
            <WholeSaleModule />
          </div>
        )}
        {isAddItemActive && (
          <div className={"absolute top-0 left-0 lg:top-0 lg:-left-[130px]"}>
            <AddItemModule />
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPage;
