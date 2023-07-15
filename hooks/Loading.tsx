import React, { PropsWithChildren, useState } from "react";
import styles from "@/styles/components/fullSizedloading.module.css";
import common from "@/styles/common.module.css";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import { Garo } from "@/components/Garo";
import { Loading } from "@/components/Loading";

export interface LoadingContextData {
  load: (promise: () => Promise<any>) => Promise<void>;
}
const defaultContextData: LoadingContextData = {
  load: (promise) => {
    return new Promise<void>((resolve, reject) => {
      reject(new Error("Provider not initlized"));
    });
  },
};
export const LoadingContext =
  React.createContext<LoadingContextData>(defaultContextData);

export function LoadingProvider({ children }: PropsWithChildren) {
  let [loadingCount, setLoadingCount] = useState(0);
  return (
    <LoadingContext.Provider
      value={{
        load: (promise) => {
          setLoadingCount((k) => k + 1);
          return new Promise((resolve, reject) => {
            promise().then((...args) => {
              setLoadingCount((k) => k - 1);
              resolve(...args);
            });
          });
        },
      }}
    >
      <Garo
        className={classNames(
          styles.loading,
          common.center,
          optCSS(loadingCount > 0, styles.enabled)
        )}
      >
        <Garo className={styles.main}>
          <Loading size={64} />
        </Garo>
      </Garo>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return React.useContext(LoadingContext);
}
