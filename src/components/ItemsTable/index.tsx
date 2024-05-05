"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

import { IoIosSearch } from "react-icons/io";
import { useButtonContext } from "@/ButtonContext";
import { RxCross2 } from "react-icons/rx";
import { checkAuthentication } from "@/AuthUtil";
import { useRouter } from "next/navigation";
import { getSearchData } from "@/app/(general)/api";

export interface Root {
  username: string;
  buyer: any;
  extra_info: any;
  before_change: any;
  after_change: AfterChange[];
  history_type: string;
  title: string;
  total_unique_items_count: number;
  total_items_count: number;
  total_price: number;
  id: number;
  timestamp: string;
}

export interface AfterChange {
  name: string;
  quantity: number;
  price: number;
}

interface IItems {
  name: string;
  quantity: number | "";
  price: number | "";
  id: number;
}

interface IItemsPerPage {
  limit?: number;
}

interface IItemsSummary {
  unique_items_count: number;
  total_items_count: number;
  total_price: number;
}

interface IHistoryItem {
  username: string;
  buyer: string | null;
  extra_info: string | null;
  before_change: any;
  after_change: any;
  history_type: string;
  title: string;
  total_unique_items_count: number;
  total_items_count: number;
  total_price: number;
  id: number;
  timestamp: string;
}

const ItemsTable = () => {
  const [items, setItems] = useState<IItems[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<IItemsPerPage>({
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const { itemUpdatingData, setItemUpdatingData, setHistoryItem } =
    useButtonContext();
  const [itemsSummary, setItemsSummary] = useState<IItemsSummary>({
    unique_items_count: 0,
    total_price: 0,
    total_items_count: 0,
  });
  const [user, setUser] = useState({
    id: 0,
    username: "",
    password: "",
    role: "",
  });
  const { isUpdateActive, setIsUpdateActive } = useButtonContext();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    if (!checkAuthentication()) {
      router.push("/login");
    }
    const getItems = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiUrl}/items/`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
          },
          params: {
            skip: 0,
            limit: itemsPerPage?.limit || 10,
          },
        });
        setItems(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching items:", err);
        throw err;
      }
    };
    const getSummary = async () => {
      try {
        const res = await axios.get(`${apiUrl}/items/summary/`, {
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

    const getUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/me/`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
          },
        });
        setUser(res.data);
        window.localStorage.setItem("username", res.data.username);
      } catch (err) {
        console.log("Error fetching user/me:", err);
        throw err;
      }
    };

    getUser();
    getSummary();
    getItems();
  }, [itemsPerPage, apiUrl, router]);

  const getHistoryItem = async (id: number) => {
    try {
      const res = await axios.get(`${apiUrl}/history/`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
      });
      const foundItem = res.data.find((item: IHistoryItem) => item.id == id);
      setHistoryItem(foundItem || null);
    } catch (err) {
      console.log("Error fetching item:", err);
      throw err;
    }
  };

  const updateClickHandle = (
    id: number,
    name: string,
    quantity: number | "",
    price: number | "",
  ) => {
    getHistoryItem(id);
    setIsUpdateActive(true);
    setItemUpdatingData({
      ...itemUpdatingData,
      id: id,
      price: price,
      quantity: quantity,
      name: name,
    });
  };

  const clearClickHandle = async () => {
    setSearchInput("");
    try {
      const res = await axios.get(`${apiUrl}/items/`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
        params: {
          skip: 0,
          limit: itemsPerPage?.limit || 10,
        },
      });
      setItems(res.data);
    } catch (err) {
      console.log("Error fetching items:", err);
      throw err;
    }
  };

  const fetchItems = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/items/`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
        params: {
          skip:
            typeof itemsPerPage.limit !== "undefined" &&
            (page - 1) * itemsPerPage.limit,
          limit: itemsPerPage.limit,
        },
      });
      setItems((prevItems) => [...prevItems, ...res.data]);
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching items:", err);
      throw err;
    }
  };

  const handleLoadMore = () => {
    if (typeof itemsPerPage.limit !== "undefined") {
      const nextPage = Math.ceil(items.length / itemsPerPage.limit) + 1;
      fetchItems(nextPage);
    }
  };

  const handleHistorySearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (searchTimeout !== null) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        fetchHistoryData(e.target.value);
      }, 500),
    );
  };

  const fetchHistoryData = async (queryString: string) => {
    try {
      const res = await getSearchData(
        queryString,
        window.localStorage.accessToken,
      );
      setItems(res.data);
      console.log("Search res:", res);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  return (
    <>
      <div
        className={
          "text-[10px] lg:text-lg bg-white border border-border rounded-lg"
        }
      >
        <div className={"p-2 flex justify-center lg:justify-end"}>
          <div
            className={
              "pl-1.5 border border-border flex items-center gap-2 rounded-md relative"
            }
          >
            <IoIosSearch className={"text-text text-xl"} />
            <input
              type="text"
              placeholder={"Поиск"}
              value={searchInput}
              className={"border-none outline-none"}
              onChange={handleHistorySearch}
            />
            {searchInput && (
              <RxCross2
                onClick={() => clearClickHandle()}
                className={"cursor-pointer"}
              />
            )}
          </div>
        </div>
        <table className={"w-screen lg:w-full"}>
          <thead>
            <tr
              className={
                "bg-[rgb(247,248,249)] text-text border-t border-border"
              }
            >
              <th className={"font-medium py-2"}>Наименование</th>
              <th className={"font-medium py-2"}>Количество в наличии</th>
              <th className={"font-medium py-2"}>Цена за единицу</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`text-center border-border relative border-y hover:bg-secondary cursor-pointer`}
                onClick={() => {
                  if (user.role === "admin") {
                    updateClickHandle(
                      item.id,
                      item.name,
                      item.quantity,
                      item.price,
                    );
                  }
                }}
              >
                <td className={"py-4"}>{item.name}</td>
                <td>{item.quantity?.toLocaleString()} шт</td>
                <td className={"w-fit pr-2"}>
                  {item.price?.toLocaleString()} тг
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`w-screen lg:w-full flex ${searchInput ? "justify-end" : "justify-between"} items-center px-4 py-3`}
      >
        {!searchInput && (
          <button
            className={
              "self-center my-3 bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
            }
            onClick={handleLoadMore}
          >
            Загрузить еще
          </button>
        )}
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

export default ItemsTable;
