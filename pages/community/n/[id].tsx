import { useRouter } from "next/router";
import HTMLRenderer from "@/components/HTML_Renderer";
import { Conatiner } from "@/components/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import CONSTANTS from "@/constants";
import styles from "@/styles/community/view.module.css";
import classNames from "@/utils/classNames";
import Link from "next/link";
import { Garo } from "@/components/Garo";
import Chat from "@/components/Chat";
import useModal from "@/utils/useModal";
import { Flex } from "@/components/Flex";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

function SkeletonP(props: { width: string }) {
  return (
    <p
      style={{
        width: props.width,
      }}
      className={classNames("skeleton", styles.skeleton)}
    ></p>
  );
}

export default function View() {
  const modal = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, settitle] = useState("로딩중");
  const [content, setcontent] = useState("<p>로딩중<p>");
  const [category, setCategory] = useState("로딩중");
  const [categoryID, setCategoryID] = useState(-1);
  const [like, setLike] = useState(false);
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [onlyAuthorChat, setOnlyAuthorChat] = useState(false);
  const { id } = router.query;

  const heartEmpty = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      className={styles.icon}
      style={{
        opacity: like ? 0 : 1,
      }}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
        fill="#aaaaaa"
      />
    </svg>
  );

  const hearyFill = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      className={styles.icon}
      style={{
        opacity: !like ? 0 : 1,
      }}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="var(--POI-UI-ERROR)"
      />
    </svg>
  );

  const emergency = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
      style={{
        color: "var(--POI-UI-ERROR)",
      }}
    >
      <path
        fill="red"
        d="M210-160v-60h61l84-277q6-19 21.5-31t35.5-12h136q20 0 35.5 12t21.5 31l84 277h61v60H210Zm125-60h290l-78-260H413l-78 260Zm115-440v-180h60v180h-60Zm235 98-43-43 128-127 42 42-127 128Zm55 192v-60h180v60H740ZM275-562 148-690l42-42 128 127-43 43ZM40-370v-60h180v60H40Zm440 150Z"
      />
    </svg>
  );

  const refrashCount = () => {
    axios.get(`/api/community/like/count?postId=${id}`).then((res) => {
      if (res.data.e == -2) {
        router.push("/auth/signin");
        return;
      }

      if (!res.data.s) return setDisabled(true);

      setLike(res.data.like);
      setCount(res.data.count);
    });
  };

  const likePost = async () => {
    await setFetching(true);
    await axios
      .post("/api/community/like/click", {
        postId: id,
      })
      .then((e) => {
        if (e.status != 200) return;
        if (!e.data.s) return;

        if (e.data.like) setLike(true);
        else setLike(false);
      });
    await refrashCount();
    await setFetching(false);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/api/community/get?id=${id}`)
      .then((res) => {
        if (res.data.e === -3) {
          router.push("/auth/signin");
          return;
        }
        if (res.data.e === -4) {
          settitle("글쓴이와 나이가 같지 않아요.");
          setDisabled(true);
          setcontent(
            `${CONSTANTS["SERVICE_NAME"]}는 나이가 같은 친구들까리만 글을 볼 수 있게 운영하고 있어요. 죄송하지만 이 글은 볼 수 없을거 같아요.`
          );
          return;
        }
        if (res.data.e == -2) {
          settitle("글을 찾을수 없어요.");
          setDisabled(true);
          setcontent(
            "<p>글을 찾을수 없는것 같아요. 다른글을 찾으러 가볼가요?</p>"
          );
          return;
        }
        if (!res.data.s) {
          settitle("이런..");
          setcontent("<p>알수없는 오류가 발생했어요.</p>");
          return;
        }
        settitle(res.data.data.title);
        setcontent(res.data.data.content);
        setCategory(res.data.data.category.name);
        setCategoryID(res.data.data.categoryID);
        setOnlyAuthorChat(res.data.data.onlyAuthorChat);
        setIsMine(res.data.isMine);
      })
      .finally(() => {
        setLoading(false);
      });
    refrashCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      <Header type="MAIN" />
      <div className={styles.container}>
        <Conatiner
          style={{
            opacity: loading ? "1" : "0",
            transform: loading ? "trnaslateX(-50%)" : "translate(-50%, 15px)",
          }}
          className={styles.transition}
        >
          <h2
            style={{
              width: "min(80%, 30rem)",
            }}
            className={classNames(
              "skeleton",
              styles.skeleton,
              styles.skeletonTitle
            )}
          ></h2>
          {[
            "min(66%, 15rem)",
            "min(95%, 33rem)",
            "min(95%, 33rem)",
            "min(35%, 10rem)",
            "min(60%, 13.2rem)",
            "min(95%, 50rem)",
          ].map((w, i) => (
            <SkeletonP width={w} key={i} />
          ))}
        </Conatiner>
        <Conatiner
          style={{
            opacity: !loading ? "1" : "0",
            transform: !loading
              ? "trnaslate(-50%, 0px)"
              : "translate(-50%, 15px)",
          }}
          className={styles.transition}
        >
          <div className={styles.head}>
            <div className={styles.cat}>
              <Link href="/community" className={styles.catLink}>
                게시판
              </Link>{" "}
              &gt;{" "}
              <Link
                href={`/community?category=${categoryID}`}
                className={styles.catLink}
              >
                {category}
              </Link>
            </div>
            <h2 className={styles.title}>{title}</h2>
            {disabled ? null : (
              <>
                <Garo
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Garo
                    gap={4}
                    style={{
                      marginBottom: "0",
                    }}
                  >
                    <div
                      className={[
                        styles.span,
                        fetching ? styles.load : "",
                      ].join(" ")}
                      onClick={likePost}
                    >
                      {heartEmpty}
                      {hearyFill}
                    </div>
                    <span>{count}</span>
                  </Garo>
                  <div
                    className={styles.span}
                    onClick={() => {
                      modal.addModal.modal({
                        RenderChildren: (props) => {
                          const [content, setContent] = useState("");
                          return (
                            <>
                              <div
                                style={{
                                  padding: "1rem",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  게시물 신고
                                </div>
                                <select
                                  style={{
                                    outline: "none",
                                    border: "0.5px solid grey",
                                    borderRadius: "5px",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <option value="harmful">유해한 게시물</option>
                                  <option value="itself">
                                    자살/자해 의심 게시물
                                  </option>
                                  <option value="tos">
                                    커뮤니티 이용수칙 위반 게시물
                                  </option>
                                  <option value="out">기타</option>
                                </select>
                                <div
                                  style={{
                                    padding: "5px",
                                  }}
                                ></div>
                                <Input
                                  placeholder="자세한 설명 부탁드립니다"
                                  onChange={(e) => {
                                    setContent(e.currentTarget.value);
                                  }}
                                />

                                <div
                                  style={{
                                    paddingTop: "0.75rem",
                                  }}
                                />
                                <Garo gap={4}>
                                  <Flex>
                                    <Button
                                      color="ERROR"
                                      style={{
                                        width: "100%",
                                      }}
                                      css={{
                                        width: "100%",
                                      }}
                                      onClick={() => {
                                        axios.post("/api/community/report", {
                                          postID: id,
                                          content: content,
                                        });
                                        props.close();
                                      }}
                                    >
                                      신고하기
                                    </Button>
                                  </Flex>
                                </Garo>
                              </div>
                            </>
                          );
                        },
                      });
                    }}
                  >
                    {emergency}
                  </div>
                </Garo>
              </>
            )}
          </div>
          <div
            style={{
              padding: "16px 24px",
            }}
          >
            <HTMLRenderer html={content} />
          </div>
          {disabled ? null : (
            <Chat postId={id} isMine={isMine} onlyAuthor={onlyAuthorChat} />
          )}
        </Conatiner>
      </div>
    </>
  );
}
