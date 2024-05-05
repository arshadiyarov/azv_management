import axios from "axios";

export const getSearchData = async (queryString: string, token: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/items/search/?name=${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};
