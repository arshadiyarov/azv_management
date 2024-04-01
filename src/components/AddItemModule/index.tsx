import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useButtonContext } from "@/ButtonContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { HiPlus } from "react-icons/hi2";

interface IAddItem {
  [key: string]: string | number;
  name: string;
  quantity: number | string;
  price: number | string;
}

const AddItemModule = () => {
  const [items, setItems] = useState<IAddItem[]>([
    {
      name: "",
      quantity: "",
      price: "",
    },
  ]);
  const [isError, setIsError] = useState(false);
  const { setIsAddItemActive } = useButtonContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const submitHandle = async (e: FormEvent) => {
    if (
      items.some(
        (item) => item.price === 0 || item.name === "" || item.quantity === 0,
      )
    ) {
      return;
    }
    try {
      const res = await axios.post(`${apiUrl}/items/`, items, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
      });
      setIsError(false);
    } catch (err) {
      console.log("Post request error:", err);
      setIsError(true);
    }
  };

  const addItemInput = () => {
    setItems([...items, { name: "", quantity: "", price: "" }]);
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsAddItemActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsAddItemActive]);

  return (
    <div className="bg-black bg-opacity-20 w-screen h-screen flex items-center justify-center text-sm lg:text-lg">
      <div
        ref={modalRef}
        className="bg-white px-5 pt-4 pb-4 rounded-md w-[450px] lg:w-[500px] max-h-[450px] lg:max-h-[800px] overflow-auto"
      >
        <div className="relative">
          <h3 className="border-b border-border text-2xl font-semibold pb-3 text-center">
            Добавить товар
          </h3>
          <button
            onClick={() => setIsAddItemActive(false)}
            className="absolute -top-3 -right-[18px] lg:-top-1 lg:-right-2 rounded-full hover:bg-black hover:bg-opacity-10 p-3 transition duration-100"
          >
            <RxCross2 />
          </button>
        </div>
        <form
          className="mt-4 flex flex-col relative"
          onSubmit={(e) => submitHandle(e)}
        >
          <div className={"relative w-full mb-3"}>
            <label
              htmlFor="title"
              className={`text-sm absolute -bottom-[12px] left-[2px]`}
            >
              Наименовние<span className="text-red-600">*</span>
            </label>
            <label
              htmlFor="quantity"
              className={`text-sm absolute -bottom-[12px] ${items.length > 1 ? "right-[113px] lg:right-[170px]" : "right-[102px] lg:right-[152px]"}`}
            >
              Кол-во<span className={"text-red-600"}>*</span>
            </label>
            <label
              htmlFor="price"
              className={`text-sm absolute -bottom-[12px] ${items.length > 1 ? "right-[52px] lg:right-[78px]" : "right-[29px] lg:right-[55px] "}`}
            >
              Цена<span className={"text-red-600"}>*</span>
            </label>
          </div>
          {items.map((item, index) => (
            <div key={index} className="mb-3 gap-3 flex items-center">
              <div className="w-full">
                <input
                  type="text"
                  name="title"
                  placeholder="Waka 13000"
                  required={true}
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  className="outline-none w-full border border-border p-1 rounded-md"
                />
              </div>
              <div className="w-[190px]">
                <input
                  type="number"
                  name="quantity"
                  required={true}
                  placeholder="150"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value),
                    )
                  }
                  className="outline-none w-full border border-border p-1 rounded-md"
                />
              </div>
              <div className="w-[190px]">
                <input
                  type="number"
                  name="price"
                  required={true}
                  placeholder="15000"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", parseInt(e.target.value))
                  }
                  className="outline-none w-full border border-border p-1 rounded-md"
                />
              </div>
              {items.length > 1 && (
                <button
                  className="flex items-center justify-center"
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  <RxCross2 className="text-red-600 border border-border" />
                </button>
              )}
            </div>
          ))}
          <button
            className="mt-4 bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
            type="button"
            onClick={addItemInput}
          >
            <HiPlus className="-ml-4 mr-2 text-xl" />
            Еще
          </button>
          <button
            type="submit"
            className="mt-10 self-center bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
          >
            Подтвердить
          </button>
          {isError && (
            <p className="absolute text-red-600 bottom-[45px] left-[79px] text-sm">
              Количество и цена не может быть нулевым
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddItemModule;
