import { Editor } from "@tinymce/tinymce-react";
import Header from "@/components/Header";
import { Conatiner } from "@/components/Container";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/community/new.module.css";
import common from "@/styles/common.module.css";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import { Loading } from "@/components/Loading";
import { Saero } from "@/components/Saero";
import { toast } from "react-toastify";
import { Garo } from "@/components/Garo";
import { Switch } from "@/components/Switch";

interface Category {
  id: number;
  name: string;
}

export default function New() {
  const editorRef = useRef(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(1);
  const [onlyAuthorView, SetOnlyAuthorView] = useState(false);
  const [useChatgpt, SetUseChatgpt] = useState(true);

  useEffect(() => {
    (async () => {
      let x = await axios.get("/api/community/category/getlist");
      if (!x.data.s) return;
      setCategories(x.data.data as Category[]);
    })();
  }, []);

  useEffect(() => {
    /* Only For Development */
    if (!window) return;
    (window as any).setCategory = setCategory;
    (window as any).setTitle = setTitle;
    (window as any).setLoaded = setLoaded;
  }, []);
  return (
    <>
      <Header type="MAIN" />
      <Conatiner
        style={{
          position: "relative",
        }}
      >
        <h2>글쓰기</h2>
        <Garo
          style={{
            justifyContent: "flex-start",
            alignItems: "stretch",
            fontSize: "1.2rem",
          }}
          gap={10}
        >
          <span>게시판 &gt; </span>
          <select
            style={{
              margin: "0px",
              padding: "0px 10px",
              border: "none",
              borderRadius: "none",
              background: "none",
              color: "black",
              cursor: "pointer",
              borderBottom: "1px solid black",
              fontSize: "0.85em",
            }}
            onChange={(e) => {
              setCategory(parseInt(e.currentTarget.value));
            }}
          >
            {categories.map((e, i) => {
              return (
                <>
                  <option key={e.id} value={e.id} onSelect={() => {}}>
                    {e.name}
                  </option>
                </>
              );
            })}
          </select>
        </Garo>
        <Saero
          gap={16}
          className={classNames(
            common.center,
            styles.loading,
            optCSS(!loaded, styles.notLoaded)
          )}
          style={{
            padding: "1rem 0px 0px",
          }}
        >
          <Loading size={48} />
          <div>Loading...</div>
        </Saero>
        <div
          className={classNames(
            styles.editor,
            optCSS(!loaded, styles.notLoaded)
          )}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            placeholder="제목"
          />

          <Editor
            onInit={(evt, editor) => {
              editorRef.current = editor as any;
              setTimeout(() => setLoaded(true), 500);
            }}
            initialValue="<p></p>"
            apiKey="4hfhaybtpdv6daln6sjpywhiay0kcdi8kwv68asnhnbfs4hh"
          />

          <Garo
            style={{
              marginTop: "0.5rem",
            }}
            gap={6}
          >
            <span
              style={{
                fontSize: "0.85em",
              }}
            >
              댓글 나만 보기
            </span>
            <Switch
              value={onlyAuthorView}
              onChange={(e) => SetOnlyAuthorView(e)}
            />

            <span
              style={{
                fontSize: "0.85em",
              }}
            >
              Chatgpt 사용
            </span>
            <Switch value={useChatgpt} onChange={(e) => SetUseChatgpt(e)} />
          </Garo>
          <Button
            onClick={() => {
              let toastId = toast.loading("전체 내용을 검사중이에요");
              axios
                .post("/api/community/set", {
                  title: title,
                  content: (editorRef.current as any).getContent(),
                  category: category,
                  oav: onlyAuthorView,
                  gpt: useChatgpt,
                })
                .then((e) => {
                  if (!e.data.s) {
                    if (e.data.e == -1)
                      return toast.update(toastId, {
                        render: "알수없는 오류가 발생하였어요.",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    else if (e.data.e == -2) {
                      router.push(`/auth/signin`);
                      return;
                    } else if (e.data.e == -3)
                      return toast.update(toastId, {
                        render:
                          "제목에서 욕설을 발견했어요. 제목을 수정해주세요.",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    else if (e.data.e == -4)
                      return toast.update(toastId, {
                        render: "글에서 욕설을 발견했어요. 글을 수정해주세요.",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                  }
                  router.push(`/community/n/${e.data.id}`);
                  toast.update(toastId, {
                    type: "success",
                    render: "성공적으로 업로드 했어요",
                    isLoading: false,
                    autoClose: 3000,
                  });
                });
            }}
            css={{
              marginTop: "1rem",
            }}
          >
            게시
          </Button>
        </div>
      </Conatiner>
    </>
  );
}
