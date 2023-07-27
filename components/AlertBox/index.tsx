import { Button } from "../Button";
import { Saero } from "../Saero";
import Header from "./Header/index";
import Item from "./Item";
import { useAlertBox } from "./context";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import axios from "axios";
import HTMLRenderer from "../HTML_Renderer";

interface Alert {
  id: string;
  type: number;
  data: any;
  uploadAt: string;
}

export default function AlertBox() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  let { opened, close } = useAlertBox();

  useEffect(() => {
    axios.get("/api/alert").then((e) => {
      setAlerts(e.data.data as Alert[]);
    });
  }, []);

  return (
    <>
      <div
        className={[styles.container, opened ? styles.enabled : ""].join(" ")}
      >
        <Saero
          style={{
            height: "100%",
          }}
        >
          <Header />
          <div className={styles.items}>
            <div className={styles.itemslist}>
              {alerts &&
                alerts.map((e, i) => {
                  if (e.type == 0)
                    return (
                      <Item
                        key={i}
                        title={e.data.title}
                        desc={
                          <>
                            <HTMLRenderer html={e.data.content} />
                          </>
                        }
                        id={e.id}
                        uploadAt={e.uploadAt}
                      />
                    );
                  else if (e.type == 1)
                    return (
                      <Item
                        key={i}
                        title="새로운 댓글이 달렸어요!"
                        desc={
                          <>
                            <HTMLRenderer
                              html={`${JSON.parse(e.data).title} 계시물에 ${
                                JSON.parse(e.data).count
                              }개의 댓글이 달렸어요!`}
                            />
                          </>
                        }
                        id={e.id}
                        uploadAt={e.uploadAt}
                      />
                    );
                  else return <></>;
                })}
            </div>
          </div>
        </Saero>
      </div>
      <div
        onClick={() => {
          close();
        }}
        className={[styles.background, opened ? styles.enabled : ""].join(" ")}
      ></div>
    </>
  );
}
