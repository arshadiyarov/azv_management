export const checkAuthentication = (): boolean => {
  const accessToken = localStorage.accessToken;
  return !!accessToken;
};

export const exitAuthentication = () => {
  const accessToken = localStorage.accessToken;
  localStorage.clear();
};
