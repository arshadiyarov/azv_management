"use client";

import React, { FormEvent, useContext, useEffect, useState } from "react";
import axios from "axios";

import { IoIosSearch } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useButtonContext } from "@/ButtonContext";
import { RxCross2 } from "react-icons/rx";
import { checkAuthentication } from "@/AuthUtil";
import { useRouter } from "next/navigation";

interface Iitems {
  name: string;
  quantity: number | "";
  price: number | "";
  id: number;
}

interface IitemsPerPage {
  limit?: number;
}

interface IitemsSummary {
  unique_items_count: number;
  total_items_count: number;
  total_price: number;
}

interface IhistoryItem {
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

interface ISuggestData {
  name: string;
  quantity: number;
  price: number;
  id: number;
}

const ItemsTable = () => {
  const [items, setItems] = useState<Iitems[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<IitemsPerPage>({
    limit: 10,
  });
  const [searchProduct, setSearchProduct] = useState("");
  const { itemUpdatingData, setItemUpdatingData, setHistoryItem } =
    useButtonContext();
  const [itemsSummary, setItemsSummary] = useState<IitemsSummary>({
    unique_items_count: 0,
    total_price: 0,
    total_items_count: 0,
  });
  const { isUpdateActive, setIsUpdateActive } = useButtonContext();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!checkAuthentication()) {
      router.push("/login");
    }
    const getItems = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiUrl}/items/`, {
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
        const res = await axios(`${apiUrl}/items/summary/`);
        setItemsSummary(res.data);
      } catch (err) {
        console.log("Error fetching items summary:", err);
        throw err;
      }
    };

    getSummary();
    getItems();
  }, [itemsPerPage, searchProduct, apiUrl, router]);

  const getHistoryItem = async (id: number) => {
    try {
      const res = await axios.get(`${apiUrl}/history/`);
      const foundItem = res.data.find((item: IhistoryItem) => item.id == id);
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
    setSearchProduct("");
    try {
      const res = await axios.get(`${apiUrl}/items/`, {
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

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${apiUrl}/items/`, {
        params: {
          skip: 0,
          limit: 99999999,
        },
      });
      const filteredItems = res.data.filter((item: Iitems) =>
        item.name.toLowerCase().includes(searchProduct.toLowerCase()),
      );
      setItems(filteredItems);
    } catch (err) {
      console.log("Error fetching items:", err);
      throw err;
    }
  };

  const handleChange = (value: string) => {
    setSearchProduct(value);
    if (value.length === 0) {
      return;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  return (
    <>
      <div
        className={
          "text-[10px] lg:text-lg bg-white border border-border rounded-lg"
        }
      >
        <div className={"p-2 flex justify-center lg:justify-end"}>
          <form
            className={
              "pl-1.5 border border-border flex items-center gap-2 rounded-md relative"
            }
          >
            <IoIosSearch className={"text-text text-xl"} />
            <input
              type="text"
              placeholder={"Поиск"}
              value={searchProduct}
              className={"border-none outline-none"}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
            {searchProduct && (
              <RxCross2
                onClick={() => clearClickHandle()}
                className={"cursor-pointer"}
              />
            )}
          </form>
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
                className={`text-center border-border relative border-y hover:bg-secondary`}
              >
                <td className={"py-4"}>{item.name}</td>
                <td>{item.quantity.toLocaleString()} шт</td>
                <td className={"w-fit pr-2"}>
                  {item.price.toLocaleString()} тг
                </td>
                <button
                  className={
                    "absolute right-0 top-[5px] lg:right-[11px] lg:top-[11px] text-lg lg:text-xl hover:bg-black hover:bg-opacity-10 rounded-full p-2"
                  }
                  onClick={() =>
                    updateClickHandle(
                      item.id,
                      item.name,
                      item.quantity,
                      item.price,
                    )
                  }
                >
                  <MdEdit />
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`w-screen lg:w-full flex ${searchProduct ? "justify-end" : "justify-between"} items-center px-4 py-3`}
      >
        {!searchProduct && (
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
