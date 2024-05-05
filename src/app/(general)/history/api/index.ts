import axios from "axios";

export const getSearchData = async (queryString: string, token: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/history/search?query_string=${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};
