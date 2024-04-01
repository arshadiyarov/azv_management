"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { checkAuthentication } from "@/AuthUtil";

interface IauthData {
  username: string;
  password: string;
}

interface Ires {
  data: {
    access_token: string;
    token_type: string;
  };
}

const Login = () => {
  const [isError, setIsError] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [authData, setAuthData] = useState<IauthData>({
    username: "",
    password: "",
  });

  const submitHandle = async (e: FormEvent) => {
    ы;
    e.preventDefault();

    try {
      const res: Ires = await axios.post(`${apiUrl}/login`, authData);
      const accessToken = res.data?.access_token;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
      router.push("/");
      setIsError(false);
    } catch (err) {
      console.log("Login error:", err);
      setAuthData({ ...authData, password: "" });
      setIsError(true);
    }
  };

  useEffect(() => {
    if (checkAuthentication()) {
      router.push("/");
    }
  }, []);

  return (
    <div
      className={
        "w-screen h-screen bg-secondary flex justify-center items-center"
      }
    >
      <div className={"bg-white p-5 rounded-lg relative"}>
        <h1 className={"text-2xl border-b border-border text-center pb-5 mb-5"}>
          Вход в аккаунт
        </h1>
        <form
          onSubmit={(e) => submitHandle(e)}
          className={
            "w-[250px] sm:w-[275px] lg:w-[300px] xl:w-[350px] space-y-3"
          }
        >
          <div>
            <label htmlFor="username">Логин</label>
            <input
              id={"username"}
              type="text"
              placeholder={"Введите логин"}
              value={authData?.username}
              onChange={(e) =>
                setAuthData({ ...authData, username: e.target.value })
              }
              className={
                "outline-none border border-border w-full p-2 mb-2 rounded-md"
              }
            />
          </div>
          <div>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder={"Введите пароль"}
              value={authData?.password}
              onChange={(e) => {
                setAuthData({ ...authData, password: e.target.value });
              }}
              className={
                "outline-none border border-border w-full p-2 mb-9 rounded-md"
              }
            />
          </div>
          {isError && (
            <p
              className={
                "flex items-center w-full gap-0.5 absolute text-center text-sm text-red-600 bottom-16 left-[32px] sm:left-[48px] lg:left-[64px] xl:left-[78px]"
              }
            >
              <HiOutlineExclamationCircle className={"text-lg"} />
              Неверный логин или пароль
            </p>
          )}
          <button
            type={"submit"}
            className={`bg-primary py-2 px-6 text-white rounded-md text-sm flex items-center justify-center h-fit hover:bg-btnHover active:bg-btnActive w-full`}
          >
            Войти
          </button>
        </form>
        {/*<p className={"text-sm text-center mt-4"}>*/}
        {/*  Нет аккаунта?*/}
        {/*  <Link href={"/sign-up"} className={"underline ml-1"}>*/}
        {/*    Создать новый*/}
        {/*  </Link>*/}
        {/*</p>*/}
      </div>
    </div>
  );
};

export default Login;
