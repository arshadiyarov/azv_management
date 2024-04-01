"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { HiPlus } from "react-icons/hi2";
import InfoBox from "@/components/ui/InfoBox";
import ItemsTable from "@/components/ItemsTable";
import { checkAuthentication } from "@/AuthUtil";
import { useRouter } from "next/navigation";
import { useButtonContext } from "@/ButtonContext";

interface IItemsSummary {
  unique_items_count: number;
  total_items_count: number;
  total_price: number;
}

interface IUser {
  id: number;
  username: string;
  password: string;
  role: string;
}

export default function Main() {
  const [itemsSummary, setItemsSummary] = useState<IItemsSummary>();
  const { setIsAddItemActive, isAddItemActive } = useButtonContext();
  const [user, setUser] = useState({
    id: 0,
    username: "",
    password: "",
    role: "",
  });
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window.localStorage !== "undefined" && !checkAuthentication()) {
      router.push("/login");
    }
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

    getSummary();
    getUser();
  }, [apiUrl, router]);

  return (
    <main className="w-screen lg:w-[1180px] pt-10 pb-4 mx-auto">
      <div className={"mb-6"}>
        <div
          className={
            "w-screen lg:w-full flex flex-col gap-10 lg:gap-0 lg:flex-row lg:justify-between"
          }
        >
          <div
            className={
              "w-[300px] text-justify mx-auto lg:mx-0 lg:text-left lg:w-[720px]"
            }
          >
            <h2 className={"text-xl lg:text-2xl font-bold mb-2"}>
              Таблица товаров
            </h2>
            <p className={"text-sm lg:text-lg text-text"}>
              {`Здесь находится таблица товаров. Вы можете просмотреть все товары
              в наличии, используя таблицу ниже. Для удобства доступен поиск
              совпадений по наименованиям, введите часть названия товара, и в
              таблице останутся только совпадения. ${user.role === "admin" ? "Чтобы добавить товар, нажмите на кнопку в правом верхнем углу." : ""}`}
            </p>
          </div>
          {user.role === "admin" && (
            <button
              className={
                "self-center lg:self-start bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
              }
              onClick={() => setIsAddItemActive(!isAddItemActive)}
            >
              <HiPlus className={"-ml-4 mr-2 text-xl"} />
              Добавить товар
            </button>
          )}
        </div>
        <div
          className={
            "flex flex-col w-screen lg:w-full gap-3 lg:gap-0 lg:flex-row items-center lg:items-start justify-between mt-10"
          }
        >
          <InfoBox
            title={"Всего уникальных товаров"}
            body={itemsSummary?.unique_items_count.toLocaleString()}
          />
          <InfoBox
            title={"Общее количество товаров"}
            body={itemsSummary?.total_items_count.toLocaleString()}
          />
          <InfoBox
            title={"Общая стоимость"}
            body={`${itemsSummary?.total_price.toLocaleString()} тг`}
          />
        </div>
      </div>
      <ItemsTable />
    </main>
  );
}
