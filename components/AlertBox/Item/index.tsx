import React, { useState } from "react";
import styles from "./style.module.css";
import { Garo } from "@/components/Garo";
import { Icon } from "@/components/Icon";
import axios from "axios";

export default function Item(props: {
  id: string;
  title: string;
  desc: React.ReactNode | string;
  uploadAt: string;
}) {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      {disabled ? (
        ""
      ) : (
        <div className={styles.container}>
          <Garo gap={8}>
            <div className={styles.body}>
              <div className={styles.title}>
                <strong>{props.title}</strong>
              </div>
              <div className={styles.desc}>{props.desc}</div>
              <div className={styles.time}>{props.uploadAt}</div>
            </div>
            <div>
              <Icon
                icon="delete_forever"
                animated
                className={styles.delete}
                onClick={() => {
                  axios.delete("/api/alert?id=" + props.id).then((e) => {
                    if (e.data.s) {
                      setDisabled(true);
                    }
                  });
                }}
              />
            </div>
          </Garo>
        </div>
      )}
    </>
  );
}
