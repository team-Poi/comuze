import Header from "@/components/Header";
import CONSTANTS from "@/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Conatiner } from "@/components/Container";

import styles from "./time.module.css";

export default function Time() {
  const [times, setTimes] = useState<string[][]>([]);
  useEffect(() => {
    axios.get("/api/neis/time").then((e) => {
      setTimes(e.data.e);
    });
  }, []);

  let maxLen = 0;
  times.forEach((time) => {
    maxLen = Math.max(maxLen, time.filter((i) => i.length > 0).length);
  });

  let texts: React.ReactNode[] = [];

  for (let i = 0; i < maxLen; i++) {
    texts.push(
      <div
        key={i}
        className={styles.timeNumber}
        style={{
          gridRow: i + 2,
        }}
      >
        {i + 1}
      </div>
    );
  }

  let frs: string[] = [];
  times.forEach(() => frs.push("1fr"));
  let dt = new Date().getDay();

  return (
    <>
      <Header />
      <Conatiner>
        <h2>시간표</h2>
        <h4
          style={{
            wordBreak: "keep-all",
          }}
        >
          우리반의 시간표를 {CONSTANTS.SERVICE_NAME}에서 확인해봐요!
        </h4>
        <div
          className={styles.gridContainer}
          style={{
            gridTemplateColumns: `auto ${frs.join(" ")}`,
          }}
        >
          {texts}
          {"월화수목금".split("").map((d, i) => {
            let el = <>{d}</>;
            if (dt == i + 1) el = <strong>{d}</strong>;
            return (
              <div
                key={i}
                className={styles.dayItem}
                style={{
                  gridColumn: i + 2,
                  background: dt == i + 1 ? "var(--colors-highlight1)" : "",
                }}
              >
                {el}
              </div>
            );
          })}
          {times.map((t, i) => (
            <>
              {t
                .filter((j) => j.length > 0)
                .map((a, j) => (
                  <div
                    key={i}
                    className={styles.subjectItem}
                    style={{
                      borderRadius:
                        j == t.length - 1
                          ? "0px 0px var(--radius) var(--radius)"
                          : "",
                      color: dt == i + 1 ? "#000" : "#aaa",
                      gridRow: j + 2,
                      gridColumn: i + 2,
                      background: dt == i + 1 ? "var(--colors-highlight1)" : "",
                    }}
                  >
                    {a
                      .replace("주제선택활동", "주제 선택")
                      .replace("진로탐색활동", "진로 탐색")
                      .replace("예술·체육활동", "예술 체육활동")
                      .replace("기술·가정", "기술 가정")}
                  </div>
                ))}
            </>
          ))}
        </div>
      </Conatiner>
    </>
  );
}
