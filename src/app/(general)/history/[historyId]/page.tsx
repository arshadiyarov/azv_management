"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import { IoIosArrowBack } from "react-icons/io";
import { checkAuthentication } from "@/AuthUtil";
import { useRouter } from "next/navigation";
import InfoBox from "@/components/ui/InfoBox";

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

interface IItemChange {
  name: string;
  quantity: number;
  price: number;
}

const HistoryId = ({ params }: { params: { historyId: number } }) => {
  const [historyItem, setHistoryItem] = useState<IHistoryItem | null>(null);
  const [itemAfterChange, setItemAfterChange] = useState<IItemChange[]>([]);
  const [itemBeforeChange, setItemBeforeChange] = useState<
    IItemChange[] | null
  >([]);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!checkAuthentication()) {
      router.push("/login");
    }

    const getHistoryItem = async () => {
      try {
        const res = await axios.get(`${apiUrl}/history/`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
          },
        });
        const foundItem = res.data.find(
          (item: IHistoryItem) => item.id == params.historyId,
        );
        setItemAfterChange(foundItem.after_change);
        setItemBeforeChange(foundItem.before_change);
        setHistoryItem(foundItem || null);
        console.log("found item:r", foundItem);
      } catch (err) {
        console.log("Error fetching item:", err);
        throw err;
      }
    };

    getHistoryItem();
  }, [params.historyId, router, apiUrl]);

  return (
    <main className={`w-full`}>
      <div
        className={
          "text-[10px] lg:text-lg w-screen lg:w-[1180px] pt-10 pb-4 mx-auto space-y-6"
        }
      >
        {historyItem && (
          <>
            <div
              className={
                "flex flex-col lg:flex-row items-center justify-between"
              }
            >
              <h3 className={"font-semibold text-xs lg:text-xl mb-5 lg:mb-0"}>
                {historyItem.title}
              </h3>
              <Link
                href={"/history"}
                className={
                  "pl-2 pr-3 py-1 bg-white border border-border rounded-md text-sm flex items-center justify-between gap-1 font-semibold"
                }
              >
                <IoIosArrowBack className={"-mb-[1px]"} />
                Назад
              </Link>
            </div>
            <div
              className={"bg-white border border-border px-4 py-3 rounded-lg"}
            >
              <h4
                className={
                  "border-b border-border text-lg lg:text-2xl font-semibold text-center pb-3"
                }
              >
                Общие данные
              </h4>
              <div className={"flex gap-5 mt-4"}>
                <ul className={"font-medium text-right"}>
                  <li>Действие совершено:</li>
                  <li>Покупатель:</li>
                  <li>Дополнительная информация:</li>
                </ul>
                <ul>
                  <li>{historyItem.username}</li>
                  <li>{historyItem.buyer ? historyItem.buyer : "Пусто"}</li>
                  <li>
                    {historyItem.extra_info ? historyItem.extra_info : "Пусто"}
                  </li>
                </ul>
              </div>
            </div>

            {historyItem.history_type !== "update" && (
              <div
                className={
                  "flex flex-col w-screen lg:w-full gap-3 lg:gap-0 lg:flex-row items-center lg:items-start justify-between mt-10"
                }
              >
                <InfoBox
                  title={"Всего добавлено товаров"}
                  body={historyItem?.total_items_count.toLocaleString()}
                />
                <InfoBox
                  title={"Количество уникальных товаров"}
                  body={historyItem?.total_unique_items_count.toLocaleString()}
                />
                <InfoBox
                  title={"Общая стоимость"}
                  body={historyItem?.total_price.toLocaleString()}
                />
              </div>
            )}

            <div className={"bg-white border border-border rounded-lg"}>
              <h4
                className={
                  "border-b border-border text-lg lg:text-2xl font-semibold pt-2 text-center pb-2"
                }
              >
                Изменения
              </h4>
              <table className={"w-full"}>
                <thead>
                  <tr
                    className={
                      "bg-[rgb(247,248,249)] text-text border-t border-border"
                    }
                  >
                    <th className={"font-medium py-2"}>Наименование</th>
                    <th className={"font-medium py-2"}>Количество</th>
                    <th className={"font-medium py-2"}>Цена за единицу</th>
                  </tr>
                </thead>
                <tbody>
                  {itemAfterChange.map((item, index) => (
                    <tr
                      key={index}
                      className={`text-center border-y border-border hover:bg-secondary`}
                    >
                      <td className={"py-4"}>{item.name}</td>
                      <td>{item.quantity} шт</td>
                      <td>{item.price} тг</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!!itemBeforeChange && (
              <div className={"bg-white border border-border rounded-lg"}>
                <h4
                  className={
                    "border-b border-border text-lg lg:text-2xl pt-2 font-semibold text-center pb-2"
                  }
                >
                  До изменений
                </h4>
                <table className={"w-full"}>
                  <thead>
                    <tr
                      className={
                        "bg-[rgb(247,248,249)] text-text border-t border-border"
                      }
                    >
                      <th className={"font-medium py-2"}>Наименование</th>
                      <th className={"font-medium py-2"}>Количество</th>
                      <th className={"font-medium py-2"}>Цена за единицу</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemBeforeChange.map((item, index) => (
                      <tr key={index} className={`text-center border-border`}>
                        <td className={"py-4"}>{item.name}</td>
                        <td>{item.quantity} шт</td>
                        <td>{item.price} тг</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default HistoryId;
