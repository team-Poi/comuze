import React, { PropsWithChildren, useState } from "react";
import styles from "@/styles/components/fullSizedloading.module.css";
import common from "@/styles/common.module.css";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import { Garo } from "@/components/Garo";
import { Loading } from "@/components/Loading";

export interface AlertContextData {
  opened: boolean;
  open: () => void;
  close: () => void;
}
const defaultContextData: AlertContextData = {
  open: () => {
    throw new Error("Provider not initlized");
  },
  close: () => {
    throw new Error("Provider not initlized");
  },
  opened: false,
};
export const AlertContext =
  React.createContext<AlertContextData>(defaultContextData);

export function AlertProvider({ children }: PropsWithChildren) {
  let [opened, setOpened] = useState(false);
  return (
    <AlertContext.Provider
      value={{
        opened: opened,
        open: () => setOpened(true),
        close: () => setOpened(false),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertBox() {
  return React.useContext(AlertContext);
}
