import React, { useState, createContext } from "react";

// Create the PopupContext with a default value of an empty object
const PopupContext = createContext({});

const StateProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRec, setIsRec] = useState(false);

  const toggleRec = () => {
    setIsRec((prevState) => !prevState);
  };

  const togglePopup = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <PopupContext.Provider value={{ isOpen, isRec, togglePopup, toggleRec }}>
      {children}
    </PopupContext.Provider>
  );
};

export { StateProvider, PopupContext };
