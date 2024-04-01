export const checkAuthentication = (): boolean => {
  if (typeof window.localStorage !== "undefined") {
    const accessToken = window.localStorage.accessToken;
    return !!accessToken;
  } else {
    return false;
  }
};

export const exitAuthentication = () => {
  if (typeof window.localStorage !== "undefined") {
    window.localStorage.clear();
  } else {
    console.log("localStorage is not available");
  }
};
