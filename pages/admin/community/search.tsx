import { Conatiner } from "@/components/Container";
import { Input } from "@/components/Input";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "@/styles/postlist.module.css";
import Link from "next/link";
import Header from "@/components/Header";
import { GetServerSidePropsContext } from "next";
import { Pagination } from "@/components/Pagination";
import prismadb from "@/utils/prisma";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import NoSSR from "react-no-ssr";
import { Garo } from "@/components/Garo";
import common from "@/styles/common.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
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
}

interface Category {
  id: number;
  name: string;
}

function LinkedTD(props: React.PropsWithChildren<{ href?: string }>) {
  return (
    <td>
      <Link href={props.href || "/"}>{props.children}</Link>
    </td>
  );
}

let defaultPosts: Post[] = [];
for (let i = 0; i < 30; i++)
  defaultPosts.push({ id: "로딩중", title: "로딩중" });

export default function Search(props: { maxPage: number }) {
  const router = useRouter();
  const { status } = useSession();
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTitle, setSearchTitle] = useState(
    (router.query.search as string) || ""
  );
  const [page, setPage] = useState(
    Math.min(
      Math.max(parseInt((router.query.page as string) || "1"), 1),
      props.maxPage
    )
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
    if (!page) {
      router.push(
        `/community/?page=1${
          router.query.category ? `&category=${router.query.category}` : ""
        }`
      );
    }
    setLoading(true);
    setPosts(defaultPosts);
    divRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    axios
      .get(
        `/api/community/search?page=${page}&title=${searchTitle}&category=${
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
  }, [page, router.query.category]);

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
                  `/community?category=${val}${
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
        <Garo className={common.center}>
          <Pagination
            value={page}
            setValue={setPage}
            maxCount={props.maxPage}
            count={5}
          />
        </Garo>
        <div className={styles.spacer} />
        <NoSSR>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <td className={styles.td}>번호</td>
                <td className={styles.td}>제목</td>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {posts &&
                posts.map((e, i) => {
                  let href = `/community/n/${e.id}`;
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
                      </tr>
                    );
                  return (
                    <tr
                      key={`tr${i}`}
                      onClick={() => {
                        router.push(href);
                      }}
                    >
                      <LinkedTD href={href} key={`td${i}a`}>
                        {e.id}
                      </LinkedTD>
                      <LinkedTD href={href} key={`td${i}b`}>
                        {e.title}
                      </LinkedTD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </NoSSR>
        <div className={styles.spacer} />
        <Garo className={common.center}>
          <Pagination
            value={page}
            setValue={setPage}
            maxCount={props.maxPage}
            count={5}
          />
        </Garo>
      </Conatiner>
      <Btn />
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // ?search=asdasd&sameAge=true&category=1
  // context.query
  const search = context.query.search as string;
  const category = context.query.category as string;
  const sameAge = true;
  let appender = {};

  if (category && category.toString() != "0") {
    appender = {
      ...appender,
      ...{
        categoryID: parseInt(category),
      },
    };
  }
  if (sameAge == true) {
    let session = await getServerSession(context.req, context.res, authOptions);
    if (!session)
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signin",
        },
        props: {},
      };
    if (session.user.age)
      appender = {
        ...appender,
        ...{
          author: {
            age: {
              lte: session.user.age + 1,
              gte: session.user.age - 1,
            },
          },
        },
      };
  }

  let dataCount = await prismadb.post.count({
    where: {
      ...(search ? { title: { contains: search } } : {}),
      ...appender,
    },
  });
  return {
    props: { maxPage: Math.ceil(dataCount / 30) },
  };
};
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
