import React from "react";
import HistoryTable from "@/components/HistoryTable";

const History = () => {
  return (
    <main className={"w-screen lg:w-[1180px] pt-10 pb-4 mx-auto"}>
      <div
        className={
          "mb-12 lg:mb-6 w-[300px] text-justify mx-auto lg:mx-0 lg:text-left lg:w-[720px]"
        }
      >
        <h2 className={"text-xl lg:text-2xl font-bold mb-2"}>
          История действий
        </h2>
        <p className={"text-sm lg:text-lg text-text"}>
          Здесь находится история действий. В таблице ниже вы можете увидеть
          каждое действие, а также кем оно было соверешено. Нажмите на строчку в
          таблице, чтобы увидеть подробности.
        </p>
      </div>
      <HistoryTable />
    </main>
  );
};

export default History;
