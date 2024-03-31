"use client";

import React, { FormEvent, useState } from "react";
import ButtonFill from "@/components/ui/buttons/ButtonFill";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IRegData {
  username: string;
  role: string;
  password: string;
}

const SignUp = () => {
  const router = useRouter();

  const [regData, setRegData] = useState<IRegData>({
    username: "",
    role: "",
    password: "",
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isError, setIsError] = useState(false);
  const [isNotSelected, setIsNotSelected] = useState(false);
  const [isPassNoMatch, setIsPassNoMatch] = useState(false);
  const [isPassShort, setIsPassShort] = useState(false);
  const [confPassword, setConfPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (regData.password.length < 8) {
      setIsPassShort(true);
      return;
    } else {
      setIsPassShort(false);
    }

    if (regData.password !== confPassword) {
      setIsPassNoMatch(true);
      return;
    } else {
      setIsPassNoMatch(false);
    }

    if (regData.role === "") {
      setIsNotSelected(true);
      return;
    } else {
      setIsNotSelected(false);
    }

    try {
      const res = await axios.post(`${apiUrl}/users/`, regData);
      setRegData({ username: "", role: "", password: "" });
      setConfPassword("");
      setIsError(false);
      router.push("/");
    } catch (err) {
      console.log("Registration error:", err);
      setIsError(true);
    }
  };

  return (
    <div className={"w-screen h-screen flex justify-center items-center"}>
      <div className={"bg-white p-5 rounded-lg relative"}>
        <h1 className={"text-2xl border-b border-border text-center pb-5 mb-5"}>
          Создание аккаунта
        </h1>
        <form onSubmit={handleSubmit} className={"w-[350px] relative"}>
          <div className={"flex items-center justify-center gap-5"}>
            <div className={"flex items-center gap-0.5"}>
              <input
                type="radio"
                id="admin"
                name="userRole"
                value="admin"
                checked={regData.role === "admin"}
                onChange={(e) =>
                  setRegData({ ...regData, role: e.target.value })
                }
                className={"cursor-pointer"}
              />
              <label htmlFor="admin" className={"cursor-pointer"}>
                Админ
              </label>
            </div>
            <div className={"flex items-center gap-0.5"}>
              <input
                type="radio"
                id="manager"
                name="userRole"
                value="manager"
                checked={regData.role === "manager"}
                onChange={(e) =>
                  setRegData({ ...regData, role: e.target.value })
                }
                className={"cursor-pointer"}
              />
              <label htmlFor="manager" className={"cursor-pointer"}>
                Менеджер
              </label>
            </div>
          </div>
          <label htmlFor="login" className={"text-sm font-medium ml-1"}>
            Логин
          </label>
          <input
            id="login"
            type="text"
            placeholder="Введите логин"
            value={regData.username}
            onChange={(e) =>
              setRegData({ ...regData, username: e.target.value })
            }
            className={
              "outline-none border border-border w-full p-2 mb-4 rounded-md"
            }
          />
          <label htmlFor="password" className={"text-sm font-medium ml-1"}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            placeholder="Введите пароль"
            value={regData.password}
            onChange={(e) =>
              setRegData({ ...regData, password: e.target.value })
            }
            className={
              "outline-none border border-border w-full p-2 mb-4 rounded-md"
            }
          />
          <label
            htmlFor="confirmPassword"
            className={"text-sm font-medium ml-1"}
          >
            Подтвердите пароль
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            className={
              "outline-none border border-border w-full p-2 mb-7 rounded-md"
            }
          />
          {isPassNoMatch && (
            <p className={"text-red-600 text-xs absolute top-[254px] left-1"}>
              Пароли не совпадают
            </p>
          )}
          {isPassShort && (
            <p className={"text-red-600 text-xs absolute top-[172px] left-1"}>
              Пароль не может быть короче 8 символов
            </p>
          )}
          {isError && (
            <p className={"text-red-600 text-xs absolute top-[91px] left-1"}>
              Такой логин уже существует
            </p>
          )}
          {isNotSelected && (
            <p
              className={
                "text-red-600 text-xs absolute top-[20px] left-[130px]"
              }
            >
              Выберите роль
            </p>
          )}
          <ButtonFill styles={"w-full"}>Зарегистрироваться</ButtonFill>
        </form>
        <p className={"text-sm text-center mt-4"}>
          Есть аккаунт?
          <Link href={"/login"} className={"underline ml-1"}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
