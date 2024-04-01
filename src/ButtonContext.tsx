"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Iitems {
  name: string;
  quantity: number | "";
  price: number | "";
  id: number;
}

interface IhistoryItem {
  username: string;
  buyer: string | null;
  extra_info: string;
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

interface ButtonState {
  isWholesaleActive: boolean;
  isRetailActive: boolean;
  isUpdateActive: boolean;
  isAddItemActive: boolean;
  isNavActive: boolean;
  itemUpdatingData: Iitems;
  historyItem: IhistoryItem;
}

interface ButtonContextType extends ButtonState {
  setIsWholesaleActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRetailActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdateActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddItemActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavActive: React.Dispatch<React.SetStateAction<boolean>>;
  setItemUpdatingData: React.Dispatch<React.SetStateAction<Iitems>>;
  setHistoryItem: React.Dispatch<React.SetStateAction<IhistoryItem>>;
}

const initialButtonState: ButtonContextType = {
  isWholesaleActive: false,
  isRetailActive: false,
  isUpdateActive: false,
  isAddItemActive: false,
  isNavActive: false,
  itemUpdatingData: { id: 0, name: "", quantity: 0, price: 0 },
  historyItem: {
    username: "",
    buyer: "",
    extra_info: "",
    before_change: "",
    after_change: "",
    history_type: "",
    title: "",
    total_unique_items_count: 0,
    total_items_count: 0,
    total_price: 0,
    id: 0,
    timestamp: "",
  },
  setIsWholesaleActive: () => {},
  setIsRetailActive: () => {},
  setIsUpdateActive: () => {},
  setIsAddItemActive: () => {},
  setItemUpdatingData: () => {},
  setHistoryItem: () => {},
  setIsNavActive: () => {},
};

const ButtonContext = createContext<ButtonContextType>(initialButtonState);

export const useButtonContext = (): ButtonContextType =>
  useContext(ButtonContext);

export const ButtonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isWholesaleActive, setIsWholesaleActive] = useState(false);
  const [isRetailActive, setIsRetailActive] = useState(false);
  const [isUpdateActive, setIsUpdateActive] = useState(false);
  const [isAddItemActive, setIsAddItemActive] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const [itemUpdatingData, setItemUpdatingData] = useState<Iitems>({
    id: 0,
    name: "",
    quantity: 0,
    price: 0,
  });
  const [historyItem, setHistoryItem] = useState<IhistoryItem>({
    username: "",
    buyer: "",
    extra_info: "",
    before_change: "",
    after_change: "",
    history_type: "",
    title: "",
    total_unique_items_count: 0,
    total_items_count: 0,
    total_price: 0,
    id: 0,
    timestamp: "",
  });

  useEffect(() => {
    console.log("effect");
    if (typeof window !== "undefined") {
      return;
    }
  }, []);

  return (
    <ButtonContext.Provider
      value={{
        isWholesaleActive,
        setIsWholesaleActive,
        isRetailActive,
        setIsRetailActive,
        isUpdateActive,
        setIsUpdateActive,
        isAddItemActive,
        setIsAddItemActive,
        itemUpdatingData,
        setItemUpdatingData,
        historyItem,
        setHistoryItem,
        isNavActive,
        setIsNavActive,
      }}
    >
      {children}
    </ButtonContext.Provider>
  );
};
