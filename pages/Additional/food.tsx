import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NoSSR from "react-no-ssr";
import { Saero } from "@/components/Saero";
import { Garo } from "@/components/Garo";
import axios from "axios";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "../../styles/error/error.module.css";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

let messages = ["오늘은 어떤 급식이 나올까요?", "오늘의 급식을 확인해봐요!"];

let date = new Date();

interface Food {
  날짜: Date;
  음식명: string[];
}

export default function Food() {
  const [foods, setFoods] = useState<Food[]>([]);
  let { status } = useSession();

  useEffect(() => {
    if (status == "loading") return;
    axios.get("/api/neis/food").then((e) => {
      setFoods(
        (e.data.e as any[]).map((j) => {
          return {
            날짜: new Date(j.날짜),
            음식명: j.음식명,
          };
        })
      );
    });
  }, [status]);

  return (
    <>
      <Header />
      <Conatiner>
        <h2
          style={{
            marginBottom: "0px",
          }}
        >
          급식표
        </h2>
        <p
          style={{
            marginLeft: "6px",
            color: "#777",
          }}
        >
          <NoSSR>{messages[Math.floor(Math.random() * messages.length)]}</NoSSR>
        </p>
        <Saero gap={8}>
          {foods.map((j, i) => (
            <FoodItem key={i} value={j} />
          ))}
          {foods.length == 0 && <><NoSSR>
              <div className={classNames(common.errorFace, common.tcenter)}>
                {words[Math.floor(Math.random() * words.length)]}
              </div>
            </NoSSR><h3 style={{
            textAlign: "center"
          }}>어.. 최근에 나올 급식이 나이스에 등록이 되있지 않아요.</h3></>}
          
        </Saero>
      </Conatiner>
    </>
  );
}
function FoodItem(props: { value: Food }) {
  return (
    <>
      <div
        style={{
          width: "100%",
          borderRadius: "1rem",
          padding: "1rem",
          boxSizing: "border-box",
          background:
            props.value.날짜.getDate() == date.getDate()
              ? "var(--colors-highlight1)"
              : "var(--colors-graylight1)",
        }}
      >
        <Garo gap={8}>
          <h3
            style={{
              margin: "0px 0px 5px 0px",
              background: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              width: "fit-content",
              boxSizing: "border-box",
            }}
          >
            점심
          </h3>
          <h3
            style={{
              margin: "0px 0px 5px 0px",
              background: "#d2d2d2",
              padding: "4px 8px",
              borderRadius: "4px",
              width: "fit-content",
              boxSizing: "border-box",
            }}
          >
            {props.value.날짜.getMonth() + 1 + "월"}
            {props.value.날짜.getDate() + "일"}
          </h3>
        </Garo>
        <Saero>
          {props.value.음식명.map((j, i) => (
            <div key={i}>{j}</div>
          ))}
        </Saero>
      </div>
    </>
  );
}
