import React, { FormEvent, useEffect, useRef, useState } from "react";

import { useButtonContext } from "@/ButtonContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const UpdateModule = () => {
  const { setIsUpdateActive } = useButtonContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const { itemUpdatingData, setItemUpdatingData, historyItem, setHistoryItem } =
    useButtonContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsUpdateActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsUpdateActive]);

  const submitHandle = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      item_update: {
        name: itemUpdatingData.name,
        quantity: itemUpdatingData.quantity,
        price: itemUpdatingData.price,
      },
      extra_info: historyItem.extra_info || "",
    };

    try {
      const res = await axios.put(
        `${apiUrl}/items/${itemUpdatingData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        },
      );
      setIsSuccess(true);
      console.log("Update successful:", res.data);
      location.reload();
    } catch (err) {
      setIsSuccess(false);
      console.error("Error updating item:", err);
    }
  };

  return (
    <div
      className={
        "bg-black bg-opacity-20 w-screen h-screen flex items-center justify-center text-sm lg:text-lg"
      }
    >
      <div
        ref={modalRef}
        className={
          "bg-white px-5 pt-4 pb-4 rounded-md w-[450px] lg:w-[500px] max-h-[450px] lg:max-h-[800px] relative"
        }
      >
        <h3 className={"text-xl text-center font-semibold"}>
          Изменить продукт
        </h3>
        <form onSubmit={(e) => submitHandle(e)}>
          <div className={"flex flex-col mb-10 gap-2"}>
            <div className={"flex flex-col"}>
              <label htmlFor="">
                Наименование<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={"name"}
                value={itemUpdatingData.name}
                required={true}
                onChange={(e) =>
                  setItemUpdatingData({
                    ...itemUpdatingData,
                    name: e.target.value,
                  })
                }
                className={"border border-border rounded-md p-2 outline-none"}
              />
            </div>

            <div className={"flex items-center justify-between gap-10"}>
              <div className={"flex flex-col"}>
                <label htmlFor="quantity">
                  Кол-во<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id={"quantity"}
                  value={itemUpdatingData.quantity}
                  required={true}
                  onChange={(e) =>
                    setItemUpdatingData({
                      ...itemUpdatingData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className={
                    "w-full border border-border rounded-md p-2 outline-none"
                  }
                />
              </div>
              <div className={"flex flex-col"}>
                <label htmlFor="quantity">
                  Цена<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id={"price"}
                  value={itemUpdatingData.price}
                  required={true}
                  onChange={(e) =>
                    setItemUpdatingData({
                      ...itemUpdatingData,
                      price: parseInt(e.target.value),
                    })
                  }
                  className={
                    "w-full border border-border rounded-md p-2 outline-none"
                  }
                />
              </div>
            </div>
            {historyItem?.extra_info !== null && (
              <div className={"flex flex-col"}>
                <label htmlFor="">
                  Причина изменения<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={"name"}
                  value={historyItem?.extra_info}
                  required={true}
                  onChange={(e) =>
                    setHistoryItem({
                      ...historyItem,
                      extra_info: e.target.value,
                    })
                  }
                  className={"border border-border rounded-md p-2 outline-none"}
                />
              </div>
            )}
          </div>
          {isSuccess && (
            <p className="absolute text-green-500 bottom-[58px] left-[208px]">
              Успешно!
            </p>
          )}
          <button
            className={
              "bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center h-fit hover:bg-btnHover active:bg-btnActive w-full"
            }
            type={"submit"}
          >
            Изменить
          </button>
        </form>
        <button
          onClick={() => setIsUpdateActive(false)}
          className={
            "absolute top-1 right-1 lg:top-2 lg:right-2 rounded-full hover:bg-black hover:bg-opacity-10 p-3 transition duration-100"
          }
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default UpdateModule;
