import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useButtonContext } from "@/ButtonContext";
import { RxCross2 } from "react-icons/rx";
import { HiPlus } from "react-icons/hi2";
import axios from "axios";

interface IProduct {
  id: string;
  buyer: string;
  name: string;
  quantity: string;
}

interface ISuggestData {
  name: string;
  quantity: number;
  price: number;
  id: number;
}

const WholeSaleModule = () => {
  const { setIsWholesaleActive } = useButtonContext();
  const [products, setProducts] = useState<IProduct[]>([
    { id: generateId(), buyer: "", name: "", quantity: "" },
  ]);
  const additionalInfoRef = useRef<HTMLTextAreaElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReqError, setIsReqError] = useState(false);
  const [suggestData, setSuggestData] = useState<ISuggestData[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [activeProductId, setActiveProductId] = useState<string>("");
  const [activeInputId, setActiveInputId] = useState<string>("");
  const [isQuantityInput, setIsQuantityInput] = useState(false);

  const handleFocus = (id: string) => {
    setActiveInputId(id);
  };

  const submitHandle = async (e: FormEvent) => {
    e.preventDefault();
    const formData = {
      buyer: products[0].buyer,
      extra_info: additionalInfoRef.current?.value || "",
      items: products.map((product) => ({
        name: product.name,
        quantity: parseInt(product.quantity),
      })),
    };

    try {
      await axios.post(`${apiUrl}/sell/wholesale`, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
      });
      setIsReqError(false);
      setIsSuccess(true);
      window.location.reload();
    } catch (error) {
      setIsReqError(true);
      setIsSuccess(false);
      console.error("Error:", error);
    }
  };

  const handleAddProduct = () => {
    const newProductId = generateId();
    setProducts([
      ...products,
      { id: newProductId, buyer: "", name: "", quantity: "" },
    ]);
    setActiveInputId(newProductId); // Set the active input field to the newly added product
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleInputChange = (id: string, key: string, value: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return { ...product, [key]: value };
        }
        return product;
      }),
    );

    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, [key]: value } : product,
    );
    setProducts(updatedProducts);
    setActiveProductId(id);

    if (key === "quantity") {
      setIsQuantityInput(true);
    } else {
      setIsQuantityInput(false);
    }

    // Clear previous timeout if exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout to fetch suggestions after 500 milliseconds
    const newTimeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  const fetchSuggestions = async (value: string) => {
    try {
      const res = await axios.get(`${apiUrl}/items/search/?name=${value}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.accessToken}`,
        },
      });
      setSuggestData(res.data);
      console.log("Successful suggestion fetch", res.data);
    } catch (err) {
      console.log("Error suggestion fetch:", err);
    }
  };

  function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  const handleAdditionalInfoChange = () => {
    if (additionalInfoRef.current) {
      additionalInfoRef.current.style.height = "auto";
      additionalInfoRef.current.style.height =
        additionalInfoRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsWholesaleActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsWholesaleActive]);

  const handleSuggestionClick = (value: string) => {
    const currentIndex = products.findIndex(
      (product) => product.id === activeProductId,
    );

    if (currentIndex !== -1) {
      const updatedProducts = products.map((product) =>
        product.id === activeProductId ? { ...product, name: value } : product,
      );
      setProducts(updatedProducts);
      setSuggestData([]);
    }
  };

  return (
    <div className="bg-black bg-opacity-20 w-screen h-screen flex items-center justify-center text-sm lg:text-lg">
      <div
        ref={modalRef}
        className="bg-white px-5 pt-4 pb-4 rounded-md w-[450px] lg:w-[500px] max-h-[450px] lg:max-h-[800px] overflow-auto"
      >
        <div className="relative">
          <h3 className="border-b border-border text-2xl font-semibold pb-3 text-center">
            Оптовая продажа
          </h3>
          <button
            onClick={() => setIsWholesaleActive(false)}
            className="absolute -top-3 -right-[18px] lg:-top-1 lg:-right-2 rounded-full hover:bg-black hover:bg-opacity-10 p-3 transition duration-100"
          >
            <RxCross2 />
          </button>
        </div>
        <form
          className="mt-4 flex flex-col gap-5 relative"
          onSubmit={(e) => submitHandle(e)}
        >
          <div>
            <label className="text-sm">
              Покупатель<span className="text-red-500">*</span>
            </label>
            <div className="border border-border p-2 rounded-md">
              <input
                type="text"
                name="buyer"
                className="w-full outline-none"
                placeholder={'ИП "Название Компании"'}
                required={true}
                value={products[0].buyer}
                onChange={(e) =>
                  handleInputChange(products[0].id, "buyer", e.target.value)
                }
              />
            </div>
          </div>
          <label className={`text-sm absolute top-[70px] lg:top-[78px]`}>
            Товары<span className={"text-red-500"}>*</span>
          </label>
          <div className="pt-3 space-y-3 mb-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex justify-between items-center gap-2"
              >
                <div className="flex justify-between gap-5 w-full">
                  <div className="w-full relative">
                    <div className="border border-border p-2 rounded-md relative">
                      <input
                        type="text"
                        id={`name-${product.id}`}
                        placeholder="Наименование"
                        className="w-full outline-none"
                        required={true}
                        value={product.name}
                        onChange={(e) =>
                          handleInputChange(product.id, "name", e.target.value)
                        }
                        onFocus={() => handleFocus(product.id)}
                      />
                    </div>
                    {product.name &&
                      activeInputId === product.id &&
                      !!suggestData.length &&
                      !isQuantityInput && (
                        <ul className="w-full max-h-[200px] overflow-y-auto bg-white absolute top-10 left-0 rounded-lg border border-border z-10">
                          {/* Suggestions for the active input field */}
                          {suggestData.map((item) => (
                            <li
                              key={item.id}
                              onClick={() => handleSuggestionClick(item.name)}
                              className="py-1 px-2 hover:bg-secondary cursor-pointer"
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <div>
                    <div className="border border-border p-2 rounded-md flex">
                      <input
                        type="number"
                        id={`quantity-${product.id}`}
                        className="w-[55px] outline-none border-b border-border text-center"
                        required={true}
                        value={product.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            product.id,
                            "quantity",
                            e.target.value,
                          )
                        }
                      />
                      <span>шт</span>
                    </div>
                  </div>
                </div>
                {products.length !== 1 && (
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center justify-center"
                    type="button"
                  >
                    <RxCross2 className="text-red-600 border border-border" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
            type="button"
          >
            <HiPlus className="-ml-4 mr-2 text-xl" />
            Еще
          </button>
          <div>
            <label htmlFor="additionalInfo" className="text-sm">
              Дополнительная информация
            </label>
            <div className="border border-border p-2 rounded-md flex">
              <textarea
                id="additionalInfo"
                ref={additionalInfoRef}
                placeholder="Необязательное поле"
                className="w-full max-h-[250px] min-h-[24px] outline-none"
                rows={1}
                onChange={handleAdditionalInfoChange}
              />
            </div>
          </div>
          <div className={"flex justify-between items-center"}>
            <button
              className="bg-primary self-end py-2 px-6 text-white rounded-md text-sm flex items-center justify-center w-fit h-fit hover:bg-btnHover active:bg-btnActive"
              type="submit"
            >
              Отправить
            </button>
            {isReqError && (
              <p className={"text-red-600"}>Неверное имя или количество</p>
            )}
            {isSuccess && <p className={"text-green-500"}>Успешно!</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WholeSaleModule;
