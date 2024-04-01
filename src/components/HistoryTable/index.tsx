import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { checkAuthentication } from "@/AuthUtil";

import { HiOutlineFilter } from "react-icons/hi";

interface IhistoryItems {
  username: string;
  buyer: string;
  extra_info: string;
  before_change: string;
  after_change: string;
  history_type: string;
  title: string;
  id: number;
  timestamp: string;
}

interface IitemsPerPage {
  limit?: number;
}

interface IitemsSummary {
  unique_items_count: number;
  total_items_count: number;
  total_price: number;
}

interface ItimeZone {
  timeZone: number;
}

const HistoryTable = () => {
  const [historyItems, setHistoryItems] = useState<IhistoryItems[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<IitemsPerPage>({
    limit: 10,
  });
  const [itemsSummary, setItemsSummary] = useState<IitemsSummary>({
    unique_items_count: 0,
    total_price: 0,
    total_items_count: 0,
  });

  const [timeZone, setTimeZone] = useState<ItimeZone>({
    timeZone: 0,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedHistoryType, setSelectedHistoryType] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof window.localStorage !== "undefined" && !checkAuthentication()) {
      router.push("/login");
    }

    const getHistoryItems = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/history/`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
          },
          params: {
            skip: 0,
            limit: itemsPerPage?.limit || 10,
            history_type: selectedHistoryType,
          },
        });
        setHistoryItems(res.data);
        setIsLoading(false);
        setTimeZone({ timeZone: new Date().getTimezoneOffset() / 60 });
      } catch (err) {
        console.log("Error fetching items:", err);
        throw err;
      }
    };

    const getSummary = async () => {
      try {
        const res = await axios(`${apiUrl}/items/summary/`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
          },
        });
        setItemsSummary(res.data);
      } catch (err) {
        console.log("Error fetching items summary:", err);
        throw err;
      }
    };

    getSummary();
    getHistoryItems();
  }, [itemsPerPage, selectedHistoryType, apiUrl, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsFilterActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsFilterActive]);

  const formatDateTime = (
    timestamp: string,
    timeZoneOffset: number,
  ): { date: string; time: string } => {
    const dateObj = new Date(timestamp);

    const adjustedDateObj = new Date(
      dateObj.getTime() + timeZoneOffset * 60 * 60 * 1000,
    );

    const date = `${adjustedDateObj.getDate()}.${adjustedDateObj.getMonth() + 1}.${adjustedDateObj.getFullYear()}`;

    const hours = adjustedDateObj.getHours();
    const minutes = adjustedDateObj.getMinutes().toString().padStart(2, "0");
    const seconds = adjustedDateObj.getSeconds().toString().padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;

    return { date, time };
  };

  const clickHandle = (id: number) => {
    router.push(`/history/${id}`);
  };

  const handleLoadMore = () => {
    if (typeof itemsPerPage.limit !== "undefined") {
      const nextPage = Math.ceil(historyItems.length / itemsPerPage.limit) + 1; // Calculate next page number
      fetchHistoryItems(nextPage); // Fetch items for the next page
    }
  };

  const fetchHistoryItems = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/history/`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
        params: {
          skip:
            typeof itemsPerPage.limit !== "undefined" &&
            (page - 1) * itemsPerPage.limit, // Calculate the offset based on page number
          limit: itemsPerPage.limit,
          history_type: selectedHistoryType,
        },
      });
      setIsLoading(false);
      setHistoryItems((prevItems) => [...prevItems, ...res.data]); // Append newly fetched items to existing items
    } catch (err) {
      console.log("Error fetching history items:", err);
      throw err;
    }
  };

  const checkHistoryType = (historyItem: IhistoryItems) => {
    switch (historyItem.history_type) {
      case "sale":
        return "Розничная продажа";
      case "opt":
        return "Оптовая продажа";
      case "add":
        return "Добавление товара";
      case "update":
        return "Изменения товара";
      default:
        return "";
    }
  };

  const filterClickHandle = (historyType: string) => {
    setIsFilterActive(false);
    setSelectedHistoryType(historyType === "all" ? "" : historyType);
  };

  return (
    <>
      <div
        className={
          "text-[10px] lg:text-lg bg-white border border-border rounded-lg relative"
        }
      >
        <HiOutlineFilter
          onClick={() => setIsFilterActive(true)}
          className={
            "absolute right-1 -top-6 text-primary text-xl cursor-pointer"
          }
        />
        {isFilterActive && (
          <ul
            ref={modalRef}
            className={
              "bg-white absolute right-0 top-0 rounded-lg text-center border border-border shadow-md"
            }
          >
            <p className={"border-b border-border py-1 px-4 font-bold"}>
              Тип действия
            </p>
            <li
              className={"hover:bg-secondary py-1.5 lg:py-1 cursor-pointer"}
              onClick={() => filterClickHandle("add")}
            >
              Добавление
            </li>
            <li
              className={"hover:bg-secondary py-1.5 lg:py-1 cursor-pointer"}
              onClick={() => filterClickHandle("update")}
            >
              Изменение
            </li>
            <li
              className={"hover:bg-secondary py-1.5 lg:py-1 cursor-pointer"}
              onClick={() => filterClickHandle("sale")}
            >
              Розничная
            </li>
            <li
              className={"hover:bg-secondary py-1.5 lg:py-1 cursor-pointer"}
              onClick={() => filterClickHandle("opt")}
            >
              Оптовая
            </li>
            <li
              className={"hover:bg-secondary py-1.5 lg:py-1 cursor-pointer"}
              onClick={() => filterClickHandle("all")}
            >
              Все
            </li>
          </ul>
        )}
        <div className={"p-3 text-center text-lg lg:text-2xl font-semibold"}>
          История
        </div>
        <table className={"w-full"}>
          <thead>
            <tr className={"bg-secondary border-t border-border text-text"}>
              <th className={"font-medium py-2"}>Дата</th>
              <th className={"font-medium py-2"}>Время</th>
              <th className={"font-medium py-2"}>Пользователь</th>
              <th className={"font-medium py-2"}>Действие</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((historyItem) => {
              const { date, time } = formatDateTime(
                historyItem.timestamp,
                timeZone?.timeZone,
              );
              return (
                <tr
                  key={historyItem.id}
                  className={`text-center border-y hover:bg-gray-50 active:bg-gray-100 cursor-pointer ${
                    historyItem.id % 2 !== 0 ? "border-y" : ""
                  }`}
                  onClick={() => clickHandle(historyItem.id)}
                >
                  <td className={"py-4"}>{date}</td>
                  <td>{time}</td>
                  <td>{historyItem.username}</td>
                  <td>{checkHistoryType(historyItem)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={"flex justify-between items-center px-4 py-3"}>
        <button
          className={
            "self-center my-3 bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
          }
          onClick={handleLoadMore}
        >
          Загрузить еще
        </button>
        {isLoading && <p>Загрузка...</p>}
        <select
          name="itemsPerPage"
          id="itemsPerPage"
          className={"border border-border p-2 cursor-pointer rounded-md"}
          value={itemsPerPage?.limit}
          onChange={(e) => {
            setItemsPerPage({ limit: parseInt(e.target.value) });
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </>
  );
};

export default HistoryTable;
