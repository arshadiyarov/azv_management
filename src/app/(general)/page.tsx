"use client";

import Header from "@/components/Header";
import Main from "@/components/MainPage";
import { useButtonContext } from "@/ButtonContext";
import RetailModule from "@/components/RetailModule";
import UpdateModule from "@/components/UpdateModule";
import AddItemModule from "@/components/AddItemModule";
import WholeSaleModule from "@/components/WholeSaleModule";
import NavBar from "@/components/NavBar";

const MainPage = () => {
  const {
    isWholesaleActive,
    isRetailActive,
    isUpdateActive,
    isAddItemActive,
    isNavActive,
  } = useButtonContext();

  return (
    <>
      <NavBar styles={`${isNavActive ? "absolute" : "hidden"}`} />

      <div
        className={`w-full relative ${isRetailActive || isWholesaleActive || isAddItemActive ? "h-screen overflow-hidden" : ""} ${isUpdateActive ? "overflow-x-hidden" : ""}`}
      >
        <Header />
        <Main />
        {isUpdateActive && (
          <div className={"fixed top-0 left-0 lg:top-0 lg:left-[130px]"}>
            <UpdateModule />
          </div>
        )}
        {isWholesaleActive && (
          <div className={"absolute top-0 left-0 lg:top-0 lg:-left-[130px]"}>
            <WholeSaleModule />
          </div>
        )}
        {isRetailActive && (
          <div className={"absolute top-0 left-0 lg:top-0 lg:-left-[130px]"}>
            <RetailModule />
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

export default MainPage;
