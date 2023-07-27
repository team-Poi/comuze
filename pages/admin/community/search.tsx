import { Conatiner } from "@/components/Container";
import { Input } from "@/components/Input";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "@/styles/postlist.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import NoSSR from "react-no-ssr";
import { Garo } from "@/components/Garo";
import common from "@/styles/common.module.css";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import mypageStyle from "@/styles/auth/mypage.module.css";

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

function RandomSkeleton() {
  return (
    <NoSSR>
      <td>
        <SkeletonP width={`${Math.random() * 70 + 25}%`} />
      </td>
    </NoSSR>
  );
}

interface Post {
  id: string;
  title: string;
  authorId: string;
  author: Author;
  reports: Report[];
}

interface Report {
  id: string;
}

interface Author {
  nickname: string;
  age: number;
}

interface Category {
  id: number;
  name: string;
}

let defaultPosts: Post[] = [];
for (let i = 0; i < 30; i++)
  defaultPosts.push({
    id: "로딩중",
    title: "로딩중",
    authorId: "로딩중",
    author: {
      nickname: "로딩중",
      age: 0,
    },
    reports: [],
  });

export default function Search() {
  const router = useRouter();
  const { status } = useSession();
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTitle, setSearchTitle] = useState(
    (router.query.search as string) || ""
  );
  const [loading, setLoading] = useState(true);
  const divRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (status == "loading") return;
    if (status == "unauthenticated") {
      signIn("auth0", {
        callbackUrl: "/community",
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  useEffect(() => {
    setLoading(true);
    setPosts(defaultPosts);
    divRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    axios
      .get(
        `/api/admin/community/search?title=${searchTitle}&category=${
          router.query.category || "0"
        }`
      )
      .then((response) => {
        setPosts(response.data.data as Post[]);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.category]);

  useEffect(() => {
    (async () => {
      let x = await axios.get("/api/community/category/getlist");
      if (!x.data.s) return;
      setCategories(x.data.data as Category[]);
    })();
  }, []);
  return (
    <>
      <Header />
      <Conatiner style={{}}>
        <h2>
          <Garo
            style={{
              justifyContent: "flex-start",
              alignItems: "stretch",
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
              value={router.query.category || "0"}
              onChange={(e) => {
                let val = parseInt(e.currentTarget.value);
                let routerQ = parseInt(
                  (router.query.category as string) || "0"
                );
                if (val == routerQ) return;
                router.push(
                  `/admin/community/search?category=${val}${
                    router.query.search ? `&search=${router.query.search}` : ""
                  }`
                );
              }}
            >
              <option value={0}>모두 보기</option>
              {categories.map((e, i) => {
                return (
                  <>
                    <option key={i} value={e.id} onSelect={() => {}}>
                      {e.name}
                    </option>
                  </>
                );
              })}
            </select>
          </Garo>
        </h2>
        <Input
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.currentTarget.value)}
          placeholder="검색어"
        />
        <div className={styles.spacer} />
        <div ref={divRef}></div>
        <div className={styles.spacer} />
        <NoSSR>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <td className={styles.td}>번호</td>
                <td className={styles.td}>제목</td>
                <td className={styles.td}>유저id</td>
                <td className={styles.td}>닉네임</td>
                <td className={styles.td}>신고</td>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {posts &&
                posts.map((e, i) => {
                  let href = `/admin/community/n/${e.id}`;
                  if (e.id == "로딩중") href = "/community";
                  if (e.id == "로딩중")
                    return (
                      <tr
                        key={i}
                        className={classNames(
                          styles.tr,
                          optCSS(loading, styles.loading)
                        )}
                      >
                        <RandomSkeleton key={`td${i}a`} />
                        <RandomSkeleton key={`td${i}b`} />
                        <RandomSkeleton key={`td${i}c`} />
                        <RandomSkeleton key={`td${i}d`} />
                        <RandomSkeleton key={`td${i}e`} />
                      </tr>
                    );
                  return (
                    <tr
                      key={`tr${i}`}
                      onClick={() => {
                        router.push(href);
                      }}
                    >
                      <td key={`td${i}a`}>{e.id}</td>
                      <td key={`td${i}b`}>{e.title}</td>
                      <td key={`td${i}c`}>{e.authorId}</td>
                      <td key={`td${i}d`}>{e.author.nickname}</td>
                      <td key={`td${i}de`}>{e.reports.length}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </NoSSR>
        <div className={styles.spacer} />
      </Conatiner>
      <Btn />
    </>
  );
}

function Btn() {
  return (
    <>
      <Button className={mypageStyle.EditInfo} onClick={() => {}}>
        <Link
          href="/community/new"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <Garo className={common.center} gap={7}>
            <Icon icon={"edit"} size={24} />
            <span>글쓰기</span>
          </Garo>
        </Link>
      </Button>
    </>
  );
}
