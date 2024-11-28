"use client";

import { createContext, useContext, useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loadingBD, setLoadingBD] = useState(false);

  return (
    <LoadingContext.Provider value={{ loadingBD, setLoadingBD }}>
      {loadingBD &&
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
