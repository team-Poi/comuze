import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NoSSR from "react-no-ssr";
import styles from "./food.module.css";
import { Loading } from "@/components/Loading";
import { Saero } from "@/components/Saero";
import { Garo } from "@/components/Garo";
import axios from "axios";

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
            <Containers key={i} value={j} />
          ))}
        </Saero>
      </Conatiner>
    </>
  );
}
function Containers(props: { value: Food }) {
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

function Team(props: { poi?: boolean }) {
  return <div></div>;
}

function I() {
  return <Team poi />;
}
