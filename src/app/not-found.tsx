import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h1>Страница не найдена</h1>
      <p>
        Вернуться на{" "}
        <Link href={"/"} className={"underline"}>
          главную
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
