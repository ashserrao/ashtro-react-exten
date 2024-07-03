export const isPopupOpen = () => {
  return {
    type: "ISPOPUPOPEN",
  };
};

export const isPopupClose = () => {
  return {
    type: "ISPOPUPCLOSE",
  };
};

export const startRec = () => {
  return {
    type: "STARTRECORDING",
  };
};

export const stopRec = () => {
  return {
    type: "STOPRECORDING",
  };
};
