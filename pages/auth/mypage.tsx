import { Garo } from "@/components/Garo";
import Header from "@/components/Header";
import { Saero } from "@/components/Saero";
import styles from "@/styles/auth/mypage.module.css";
import main_styles from "../Home.module.css";
import common from "@/styles/common.module.css";
import classNames from "@/utils/classNames";

import { Conatiner } from "@/components/Container";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Flex } from "@/components/Flex";
import { useEffect, useState } from "react";
import { Input } from "@/components/Input";
import SetState from "@/@types/setState";

import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLoading } from "@/hooks/Loading";
import InfScroll from "@/components/EZInfscroll";
import Link from "next/link";

export default function Page() {
  let { status, data } = useSession();
  let router = useRouter();
  const [joinedDate, setJoinedDate] = useState("로딩중");
  const [postCount, setPostCount] = useState("로딩중");
  const [likeCount, setLikeCount] = useState("로딩중");
  const [grade, setGrade] = useState(0);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [Class, setClass] = useState(0);
  const GetDetailedUserInfo = async () => {
    let { data } = await axios.get("/api/auth/info");
    return data;
  };
  const formatDate = (now: Date) => {
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  };
  useEffect(() => {
    (async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const userInfo = await GetDetailedUserInfo();
      setJoinedDate(formatDate(new Date(userInfo.e.joinedAt)));
      setLikeCount(`${userInfo.e.likesCount}개`);
      setPostCount(`${userInfo.e.postCount}개`);
    })();
  });

  const getBaseAge = (age: number) => {
    if (age >= 16) return 15;
    if (age >= 14) return 13;
    return 7;
  };
  const age2grade = (age: number) => {
    return age - getBaseAge(age);
  };
  const grade2age = (grade: number) => {
    if (!data?.user.age) return;
    return getBaseAge(data.user.age) + grade;
  };
  useEffect(() => {
    if (status == "loading") return;
    if (status == "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    setNickname(data?.user.nickname || data?.user.name || "");
    setClass(data?.user.classNumber || 0);
    setGrade(age2grade(data?.user.age || 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const sendData = () => {
    return new Promise<boolean>(async (resolve, reject) => {
      let Sd = await axios.post("/api/auth/mypage", {
        nickname: nickname,
        age: grade2age(grade),
        Class: Class,
      });
      if (Sd.data.s) {
        toast.success("정보 변경이 성공적으로 완료 되었습니다!");
        return resolve(true);
      }

      const messages: { [key: string]: string } = {
        "-1": "로그인 하지 않았습니다.",
        "-2": "이미 사용중인 닉네임 입니다.",
      };

      toast.error(messages[Sd.data.e]);
      return resolve(false);
    });
  };

  return (
    <>
      <div className={styles.container}>
        <Header type="MAIN" />
        <ToastContainer />
        <div className={styles.upper}>
          <Conatiner>
            <h1 className={main_styles.serviceNameContainer}>
              <strong>
                <span className={styles.serviceName}>
                  <span className={styles.borderBottomServiceName}>
                    <span>마이페이지</span>
                  </span>
                </span>
              </strong>
              <div className={styles.nick}>
                <strong>{data?.user.nickname}</strong>님 환영해요!
              </div>
            </h1>
          </Conatiner>
        </div>
        <div className={styles.lower}>
          <Conatiner>
            <Garo className={styles.garo}>
              <Flex className={classNames(styles.section, styles.lside)}>
                <Saero gap={8}>
                  <Item title="가입한 날">{joinedDate}</Item>
                  <Item title="작성한 글">{postCount}</Item>
                  <Item title="좋아요 수">{likeCount}</Item>
                </Saero>
              </Flex>
              <Flex className={classNames(styles.section, styles.rside)}>
                <Saero gap={8}>
                  <Input
                    className={styles.ipt}
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => {
                      if (!editing) return;
                      setNickname(e.currentTarget.value);
                    }}
                  />
                  <Input
                    className={styles.ipt}
                    placeholder="학년"
                    value={grade}
                    onChange={(e) => {
                      if (!editing) return;
                      setGrade(parseInt(e.currentTarget.value));
                    }}
                  />
                  <Input
                    className={styles.ipt}
                    placeholder="반"
                    value={Class}
                    onChange={(e) => {
                      if (!editing) return;
                      setClass(parseInt(e.currentTarget.value));
                    }}
                  />
                  <div>
                    <SchoolChange editing={editing} />
                  </div>
                </Saero>
              </Flex>
            </Garo>
            <Garo className={styles.garo}>
              <Flex className={classNames(styles.section, styles.lside)}>
                <h2
                  style={{
                    margin: "0px",
                  }}
                >
                  작성한 글
                </h2>
                <Saero gap={8}>
                  {InfScroll<{
                    title: string;
                    comment: string;
                    date: string;
                  }>({
                    fetchData: async () => {
                      let { data } = await axios.get(
                        "/api/auth/writtenArticle"
                      );
                      return {
                        data: data,
                      };
                    },
                    dataMapper: (data: any) => {
                      return (
                        <Article
                          title={data.title}
                          date={formatDate(new Date(data.uploadedAt))}
                          link={data.id}
                        />
                      );
                    },
                    minDataCount: 2000,
                  })()}
                </Saero>
              </Flex>
            </Garo>
          </Conatiner>
          <Btn status={editing} setStatus={setEditing} sendData={sendData} />
        </div>
      </div>
    </>
  );
}
function Article(props: { title: string; date: any; link: string }) {
  return (
    <>
      <Link
        href={`https://kcf.ert.im/community/n/` + props.link}
        style={{
          textDecoration: "none",
        }}
      >
        <Saero
          gap={8}
          style={{
            marginBottom: "10px",
            textDecoration: "none",
            color: "black",
          }}
        >
          <Garo
            gap={8}
            style={{
              alignItems: "stretch",
              backgroundColor: "#f1f3f5",
              padding: "10px",
              borderRadius: "8px",
              justifyContent: "space-between",
            }}
          >
            <div>{props.title}</div>
            <Garo gap={8}>
              <div>{props.date}</div>
            </Garo>
          </Garo>
        </Saero>
      </Link>
    </>
  );
}
function Item(props: { title: string; children: any }) {
  return (
    <>
      <Garo
        gap={8}
        style={{
          alignItems: "stretch",
          backgroundColor: "#f1f3f5",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div>{props.title}</div>
        <div className={styles.divider}></div>
        <div>{props.children}</div>
      </Garo>
    </>
  );
}
function Btn(props: {
  status: boolean;
  setStatus: SetState<boolean>;
  sendData: () => Promise<boolean>;
}) {
  let { update } = useSession();
  let { load } = useLoading();
  return (
    <>
      <Button
        className={styles.EditInfo}
        onClick={() => {
          if (props.status) {
            // In editing
            return load(() =>
              props.sendData().then((saved) => {
                update();
                if (!saved) return;
                props.setStatus((j) => !j);
              })
            );
          }
          props.setStatus((j) => !j);
        }}
      >
        <Garo className={common.center} gap={7}>
          <Icon icon={props.status ? "save" : "edit"} size={24} />
          <span>{props.status ? "저장" : "수정"}하기</span>
        </Garo>
      </Button>
    </>
  );
}
function SchoolChange(props: { editing: boolean }) {
  let router = useRouter();
  let { data } = useSession();
  if (!props.editing)
    return (
      <>
        <Input
          className={styles.ipt}
          placeholder="학교"
          value={data?.user.school?.schoolName}
          onChange={(e) => {
            if (!props.editing) return;
          }}
        />
      </>
    );
  else
    return (
      <>
        <Button
          onClick={function () {
            router.push("/auth/changeSchool");
          }}
        >
          학교 수정하러 가기
        </Button>
      </>
    );
}
