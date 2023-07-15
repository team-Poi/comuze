import { Conatiner } from "@/components/Container";
import { Input } from "@/components/Input";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "@/styles/postlist.module.css";
import Header from "@/components/Header";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import NoSSR from "react-no-ssr";
import { Garo } from "@/components/Garo";
import { Button } from "@/components/Button";
import useModal from "@/utils/useModal";
import { Flex } from "@/components/Flex";
import { Switch } from "@/components/Switch";

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

interface Category {
  id: string;
  name: string;
}

let defaultCategories: Category[] = [];
for (let i = 0; i < 30; i++)
  defaultCategories.push({
    id: "로딩중",
    name: "로딩중",
  });

export default function Search(props: { maxPage: number }) {
  const modal = useModal();
  const router = useRouter();
  const { status, data } = useSession();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  const divRef = React.createRef<HTMLDivElement>();
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
      .get("/api/admin/community/category/search")
      .then((response) => {
        setCategories(response.data.data as Category[]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    refrash();
  }, []);

  return (
    <>
      <Header />
      <Conatiner style={{}}>
        <h2>카테고리 관리</h2>
        <div ref={divRef}></div>
        <div className={styles.spacer} />
        <NoSSR>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <td className={styles.td}>id</td>
                <td className={styles.td}>Name</td>
                <td className={styles.td}>Manage</td>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {categories &&
                categories.map((e, i) => {
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
                      </tr>
                    );
                  return (
                    <tr key={`tr${i}`}>
                      <td key={`td${i}a`}>{e.id}</td>
                      <td key={`td${i}b`}>{e.name}</td>
                      <td key={`td${i}c`}>
                        <Button
                          onClick={() => {
                            modal.addModal.modal({
                              RenderChildren: (props) => {
                                const [title, setTitle] = useState(e.name);
                                const [show, setShow] = useState(true);
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
                                      카테고리 관리
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                      }}
                                    />
                                    <Input
                                      value={title}
                                      onChange={(e) =>
                                        setTitle(e.currentTarget.value)
                                      }
                                      placeholder="제목"
                                    />
                                    <Switch
                                      value={show}
                                      onChange={(e) => setShow(e)}
                                    />
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
                                                `/api/admin/community/category/remove`,
                                                {
                                                  id: e.id.toString(),
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
                                                `/api/admin/community/category/set`,
                                                {
                                                  id: e.id.toString(),
                                                  title: title,
                                                  show: show,
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
                              canExit: true,
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
      </Conatiner>
    </>
  );
}
