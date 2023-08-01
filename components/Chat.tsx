/* eslint-disable react-hooks/exhaustive-deps */
import style from "@/styles/chat.module.css";
import { Icon } from "./Icon";
import NoSSR from "react-no-ssr";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useModal from "@/utils/useModal";
import { Garo } from "./Garo";

interface Message {
  id: string;
  isMine: boolean;
  content: string;
  authorName: string;
  isGptRecall: boolean;
}

export default function Chat(props: {
  postId: any;
  isMine: boolean;
  onlyAuthor: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const modal = useModal();

  useEffect(() => {
    refrash();
    // 일단 25초마다 새로고침하게 해뒀는데 문제 있을거같으면 삭재 ㄱㄱ
    let inter = setInterval(async () => {
      await refrash();
    }, 25000);

    return () => {
      clearInterval(inter);
    };
  }, [props.postId]);

  const refrash = async () => {
    if (!props.postId) return;
    await axios.get("/api/chat/get?postId=" + props.postId).then((e) => {
      if (e.status != 200) return;
      setMessages(e.data.data as Message[]);
    });
  };

  const send = async () => {
    if (!input) return;

    let t = toast.loading("글을 입력하는 중이에요.");

    await axios
      .post("/api/chat/set", {
        content: input,
        postId: props.postId,
      })
      .then((e) => {
        if (e.data.s == false) {
          switch (e.data.e) {
            case -1:
              toast.error("알수없는 오류가 발생했습니다.");
              break;
            case -4:
              toast.update(t, {
                render: "댓글에 욕설을 감지했어요. 글을 수정해주세요!",
                autoClose: 3000,
                type: "error",
                isLoading: false,
              });
              break;
          }

          return;
        }
        toast.update(t, {
          render: "댓글 작성에 성공하였습니다.",
          autoClose: 3000,
          type: "success",
          isLoading: false,
        });
      })
      .catch((e) => {
        return toast.update(t, {
          render: "알수없는 오류가 발생했습니다.",
          autoClose: 3000,
          type: "error",
          isLoading: false,
        });
      })
      .finally(async () => {
        setInput("");
        await refrash();
      });
  };

  const chatRegen = (cid: string) => {
    modal.addModal
      .confirm({
        title: "정말로 다시 생성하실 건가요?",
        body: "다시 생성하면 기존 메시지는 볼수 없어요",
        okayButton: "네",
        cancelButton: "아니요",
      })
      .then((me) => {
        if (me == "YES") {
          let toastId = toast.loading("글을 생성하는중이에요.");
          axios
            .post("/api/chat/chatgpt", {
              postId: props.postId,
              chatId: cid,
            })
            .then((e) => {
              if (!e.data.s)
                return toast.update(toastId, {
                  render: "알수없는 오류가 발생하였어요.",
                  type: "error",
                  isLoading: false,
                  autoClose: 3000,
                });
              refrash();
              return toast.update(toastId, {
                render: "글 생성에 성공했어요!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
            });
        }
      });
  };

  return (
    <>
      <div
        className="imessage"
        style={{
          height: "auto",
        }}
      >
        <h2>댓글</h2>
        <div
          className={style.submitContainer}
          style={{
            display: props.onlyAuthor && props.isMine ? "none" : "",
          }}
        >
          <div className={style.ccontainer}>
            <div className={style.inputContainer}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="내용"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    send();
                  }
                }}
                maxLength={80}
              />
            </div>
            <div
              className={style.sendContainer}
              onClick={() => {
                send();
              }}
            >
              <Icon
                icon="arrow_upward"
                style={{
                  color: "white",
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((e, i) => {
            return (
              <>
                <p key={i} className={e.isMine ? "from-me" : "from-them"}>
                  <div
                    style={{
                      marginBottom: "0.2rem",
                    }}
                  >
                    <Garo
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <strong>{e.authorName}</strong>
                      {e.authorName == "Chatgpt" && (
                        <>
                          <span
                            style={{
                              margin: "0.2rem",
                              color: "white",
                              padding: "0.1rem 0.3rem",
                              backgroundColor: "#5765f2",
                              fontSize: "0.8rem",
                              borderRadius: "0.2rem",
                              verticalAlign: "middle",
                            }}
                          >
                            Bot
                          </span>
                          {props.isMine && e.isGptRecall && (
                            <button
                              className="gen-button"
                              style={{
                                float: "right",
                                border: "0",
                                background: "var(--POI-UI-PRIMARY)",
                                color: "white",
                                borderRadius: "0.2rem",
                                height: "19.1922px",
                              }}
                              onClick={() => chatRegen(e.id)}
                            >
                              다시 생성하기
                            </button>
                          )}
                        </>
                      )}
                    </Garo>
                  </div>
                  {e.content}
                </p>
              </>
            );
          })}
        </div>
        <NoSSR>
          <style>{`.imessage{background-color:#fff;border:1px solid #e5e5ea;border-radius:.25rem;display:flex;flex-direction:column;font-size:1rem;margin:1rem auto;max-width:600px;padding:.5rem 1.5rem}.imessage p{border-radius:1.15rem;line-height:1.25;max-width:75%;padding:.5rem .875rem;position:relative;word-wrap:break-word}.imessage p::after,.imessage p::before{bottom:-.1rem;content:"";height:1rem;position:absolute}p.from-me{align-self:flex-end;background-color:#248bf5;color:#fff}p.from-me::before{border-bottom-left-radius:.8rem .7rem;border-right:1rem solid #248bf5;right:-.35rem;transform:translate(0,-.1rem)}p.from-me::after{background-color:#fff;border-bottom-left-radius:.5rem;right:-40px;transform:translate(-30px,-2px);width:10px}p[class^=from-]{margin:.5rem 0;width:fit-content}p.from-me~p.from-me,p.from-me~p.from-me:not(:last-child){margin:.25rem 0 0}p.from-me~p.from-me:last-child{margin-bottom:.5rem}p.from-them{align-items:flex-start;background-color:#e5e5ea;color:#000}p.from-them:before{border-bottom-right-radius:.8rem .7rem;border-left:1rem solid #e5e5ea;left:-.35rem;transform:translate(0,-.1rem)}p.from-them::after{background-color:#fff;border-bottom-right-radius:.5rem;left:20px;transform:translate(-30px,-2px);width:10px}p[class^=from-].emoji{background:0 0;font-size:2.5rem}p[class^=from-].emoji::before{content:none}.no-tail::before{display:none} .gen-button:hover {cursor: pointer;}`}</style>
        </NoSSR>
      </div>
    </>
  );
}
