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
import { Button } from "@/components/Button";
import useModal from "@/utils/useModal";
import { Flex } from "@/components/Flex";
import { Switch } from "@/components/Switch";
import { Saero } from "@/components/Saero";

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

interface User {
  id: string;
  name: string;
  nickname: string;
  schoolId: string;
}

function LinkedTD(props: React.PropsWithChildren<{ href?: string }>) {
  return (
    <td>
      <Link href={props.href || "/"}>{props.children}</Link>
    </td>
  );
}

let defaultUsers: User[] = [];
for (let i = 0; i < 30; i++)
  defaultUsers.push({
    id: "로딩중",
    name: "로딩중",
    schoolId: "로딩중",
    nickname: "로딩중",
  });

export default function Search(props: { maxPage: number }) {
  const router = useRouter();
  const { status, data } = useSession();
  const [users, setUsers] = useState<User[]>(defaultUsers);
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
  const modal = useModal();
  useEffect(() => {
    if (status == "loading") return;
    if (status == "unauthenticated") {
      signIn("auth0", {
        callbackUrl: "/",
      });
      return;
    }
    if (status == "authenticated") {
      if (!data.user.isAdmin) router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const refrash = async () => {
    await axios
      .get(`/api/admin/user/search?page=${page}&title=${searchTitle}`)
      .then((response) => {
        setUsers(response.data.data as User[]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!page) {
      router.push("/admin/user/search/?page=1");
    }
    setLoading(true);
    setUsers(defaultUsers);
    divRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    refrash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Header />
      <Conatiner style={{}}>
        <Input
          value={searchTitle}
          onChange={async (e) => {
            await setSearchTitle(e.currentTarget.value);
          }}
          placeholder="검색어"
        />
        <Button onClick={refrash}>검색</Button>

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
                <td className={styles.td}>id</td>
                <td className={styles.td}>Auth0 id</td>
                <td className={styles.td}>nickname</td>
                <td className={styles.td}>학교 Id</td>
                <td className={styles.td}>관리</td>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {users &&
                users.map((e, i) => {
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
                    <tr key={`tr${i}`}>
                      <td key={`td${i}a`}>{e.id}</td>
                      <td key={`td${i}b`}>{e.name}</td>
                      <td key={`td${i}c`}>{e.nickname}</td>
                      <td key={`td${i}d`}>{e.schoolId}</td>
                      <td key={`td${i}e`}>
                        <Button
                          onClick={() => {
                            axios
                              .get("/api/admin/user/get?id=" + e.id)
                              .then((r) => {
                                if (r.status != 200) return;
                                modal.addModal.modal({
                                  RenderChildren: (props) => {
                                    const [nickname, setNickname] = useState(
                                      r.data.data.nickname
                                    );
                                    const [age, setAge] = useState(
                                      r.data.data.age
                                    );
                                    const [classNumber, setClassNumber] =
                                      useState(r.data.data.classNumber);
                                    const [schoolId, setSchoolId] = useState(
                                      r.data.data.schoolId
                                    );
                                    const [isAdmin, setIsAdmin] = useState(
                                      r.data.data.isAdmin
                                    );
                                    return (
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
                                          유저 관리
                                        </div>
                                        <div
                                          style={{
                                            paddingTop: "1rem",
                                          }}
                                        />
                                        <Saero gap={4}>
                                          <Input
                                            placeholder="닉네임"
                                            value={nickname}
                                            onChange={(e) =>
                                              setNickname(e.currentTarget.value)
                                            }
                                          />
                                          <Input
                                            placeholder="나이"
                                            value={age}
                                            onChange={(e) =>
                                              setAge(e.currentTarget.value)
                                            }
                                          />
                                          <Input
                                            placeholder="반"
                                            value={classNumber}
                                            onChange={(e) =>
                                              setClassNumber(
                                                e.currentTarget.value
                                              )
                                            }
                                          />
                                          <Input
                                            placeholder="학교id"
                                            value={schoolId}
                                            onChange={(e) =>
                                              setSchoolId(e.currentTarget.value)
                                            }
                                          />
                                        </Saero>
                                        <Garo gap={6}>
                                          <span>Admin</span>
                                          <Switch
                                            value={isAdmin}
                                            onChange={(e) => setIsAdmin(e)}
                                          />
                                        </Garo>
                                        <div
                                          style={{
                                            paddingTop: "1rem",
                                          }}
                                        />
                                        <Garo gap={4}>
                                          <Flex>
                                            <Button
                                              style={{
                                                width: "100%",
                                              }}
                                              css={{
                                                width: "100%",
                                              }}
                                              color="ERROR"
                                              onClick={() => {
                                                axios
                                                  .post(
                                                    `/api/admin/user/remove`,
                                                    {
                                                      id: e.id.toString(),
                                                    }
                                                  )
                                                  .then(async (e) => {
                                                    await props.close();
                                                    if (e.status != 200)
                                                      return alert(e.data);
                                                    if (!e.data.s)
                                                      return alert(e.data);
                                                    await refrash();
                                                  });
                                              }}
                                            >
                                              삭재
                                            </Button>
                                          </Flex>
                                          <Flex>
                                            <Button
                                              style={{
                                                width: "100%",
                                              }}
                                              css={{
                                                width: "100%",
                                              }}
                                              onClick={() => {
                                                axios
                                                  .post(
                                                    `/api/admin/user/edit`,
                                                    {
                                                      id: e.id.toString(),
                                                      nickname: nickname,
                                                      age: parseInt(age),
                                                      class:
                                                        parseInt(classNumber),
                                                      school: schoolId,
                                                    }
                                                  )
                                                  .then(async (e) => {
                                                    if (e.status != 200) return;
                                                    if (!e.data.s) return;
                                                    await refrash();
                                                    await props.close();
                                                  });
                                              }}
                                            >
                                              수정
                                            </Button>
                                          </Flex>
                                        </Garo>
                                      </div>
                                    );
                                  },
                                });
                              });
                          }}
                        >
                          관리
                        </Button>
                      </td>
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
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // ?search=asdasd&sameAge=true&category=1
  // context.query
  const search = context.query.search as string;

  let appender = {};

  let dataCount = await prismadb.user.count({
    where: {
      ...(search ? { nickname: { contains: search } } : {}),
      ...appender,
    },
  });
  return {
    props: { maxPage: Math.ceil(dataCount / 30) },
  };
};
