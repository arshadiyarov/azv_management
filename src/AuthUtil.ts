export const checkAuthentication = (): boolean => {
  if (typeof window.localStorage !== undefined) {
    const accessToken = localStorage.accessToken;
    return !!accessToken;
  } else {
    return false;
  }
};

export const exitAuthentication = () => {
  if (typeof window.localStorage !== undefined) {
    localStorage.clear();
  } else {
    console.log("localStorage is not available");
  }
};
