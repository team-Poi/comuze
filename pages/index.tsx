import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import CONSTANTS from "@/constants";
import styles from "./Home.module.css";
import { useEffect, useRef, useState } from "react";
import prismadb from "@/utils/prisma";
import Link from "next/link";

let messageLists = ["편리하게", "즐겁게", "행복하게", "신나게", "안전하게"];
let messageAnimations: string[] = [messageLists[0]];

function removeMesssages() {
  let dt = messageAnimations[messageAnimations.length - 1];
  while (dt.length > 0) {
    messageAnimations.push(dt.substring(0, dt.length - 1));
    dt = dt.substring(0, dt.length - 1);
  }
}

function delayMessages(times?: number) {
  for (let i = 0; i < (times || 33); i++)
    messageAnimations.push(messageAnimations[messageAnimations.length - 1]);
}

function addMessages(index: number) {
  let addedStr = "";
  let msg = messageLists[index];
  for (let i = 0; i < msg.length; i++) {
    addedStr += msg.charAt(i);
    messageAnimations.push(addedStr);
  }
}

for (let i = 1; i < messageLists.length; i++) {
  delayMessages();
  removeMesssages();
  delayMessages(3);
  addMessages(i);
}

delayMessages();
removeMesssages();
delayMessages(3);
addMessages(0);

export default function Home(props: { userCount: number; postCount: number }) {
  let [makeSchoolLike, setMakeSchoolLike] = useState(messageAnimations[0]);
  let schoolLikeIndex = useRef(1);
  const intervaler = () => {
    setMakeSchoolLike(messageAnimations[schoolLikeIndex.current]);
    schoolLikeIndex.current =
      (schoolLikeIndex.current + 1) % messageAnimations.length;
  };
  useEffect(() => {
    let inter = setInterval(intervaler, 75, schoolLikeIndex, 0);
    return () => {
      clearInterval(inter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Header type="MAIN" />
      <div className={styles.section}>
        <Conatiner>
          <h1 className={styles.headTitle}>
            학교 생활을 더{" "}
            <span className={styles.makeSchoolLike}>{makeSchoolLike}</span>
            <span className={styles.cursor}>!</span>
          </h1>
          <h1 className={styles.serviceNameContainer}>
            <strong>
              <span className={styles.serviceName}>
                <span className={styles.borderBottomServiceName}>
                  {CONSTANTS["SERVICE_NAME"]}
                </span>
                !
              </span>
            </strong>
          </h1>
        </Conatiner>
      </div>
      <div
        className={styles.section}
        style={{
          background: "#f9f9f9",
        }}
      >
        <Conatiner>
          <h2>
            <li>
              <strong>{props.userCount}</strong>명의 학생들이{" "}
              {CONSTANTS["SERVICE_NAME"]}를 선택해 주었어요.
            </li>
          </h2>
          <h2>
            <li>
              지금까지 <strong>{props.postCount}</strong>개의 글이 올라와
              있어요.
            </li>
          </h2>
        </Conatiner>
      </div>
      <div className={styles.section}>
        <Conatiner>
          <h1 className={styles.serviceNameContainer}>
            <strong>
              <span className={styles.serviceName}>
                <span className={styles.smaller}>
                  <span className={styles.borderBottomServiceName}>
                    저희는요!
                  </span>
                </span>
              </span>
            </strong>
          </h1>
          <section className={styles.descs}>
            <h3>
              <strong>첫째</strong>, 같은 또래의 학생끼리 소통할 수 있는
              커뮤니티를 만들기 위해 노력하고 있어요.
            </h3>
            <h3>
              <strong>둘째</strong>, 학생들이 편하게 학교생활을 할 수 있도록
              노력하고 있어요.
            </h3>
          </section>
        </Conatiner>
      </div>
      <div
        className={styles.section}
        style={{
          background: "#f9f9f9",
        }}
      >
        <Conatiner>
          <h2>메뉴</h2>
          <div
            style={{
              padding: "0px 1em",
            }}
          >
            <Link href="/license">
              <h3>라이선스</h3>
            </Link>
          </div>
        </Conatiner>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      userCount: await prismadb.user.count(),
      postCount: await prismadb.post.count(),
    },
  };
};
