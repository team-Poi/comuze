import { Icon } from "../Icon";
import { Garo } from "../Garo";
import optCSS from "@/utils/optCSS";
import classNames from "@/utils/classNames";
import styles from "./style.module.css";
import HomeType, { IconDefine } from "@/@types/homeType";
import Link from "next/link";
import CONSTANTS from "@/constants";
import { useState } from "react";
import { Saero } from "../Saero";
import { useSession } from "next-auth/react";

interface HeaderProps {
  type?: HomeType;
  href?: string;
  featureType?: string;
}

export default function Header(props: HeaderProps) {
  let [enabled, setEnabled] = useState(false);
  let { status, data } = useSession();
  const toggle = () => setEnabled((j) => !j);

  return (
    <>
      <header className={styles.header}>
        <Link
          href={props.href || "/"}
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            animated
            icon={IconDefine[props.type || "MAIN"]}
            className={styles.logo}
            style={{
              color: props.type == "MAIN" ? "var(--POI-UI-ERROR)" : "black",
            }}
          />
          <div
            className={classNames(
              styles.title,
              optCSS(props.type == "MAIN", styles.main)
            )}
          >
            {CONSTANTS.SERVICE_NAME}
            {props.featureType ? " / " + props.featureType : ""}
          </div>
        </Link>
        <Garo gap={6}>
          <div onClick={toggle} className={styles.menuToggle}>
            <Icon icon="menu" animated size={40} />
          </div>
        </Garo>
      </header>

      <div
        className={styles.sideMenu}
        style={{
          transform: `translateX(${enabled ? "0px" : "100%"})`,
        }}
      >
        <Garo className={styles.menuTitle}>
          <h1
            style={{
              margin: "0px",
            }}
          >
            Menu
          </h1>
          <div onClick={toggle} className={styles.menuToggle}>
            <Icon icon="close" animated size={40} />
          </div>
        </Garo>
        <Saero>
          {/* ㅇㅇ님 안녕하세요! */}
          <div className={styles.welcome}>
            <Garo>
              {data?.user.isAdmin === true ? (
                <>
                  <div
                    style={{
                      background: "var(--POI-UI-ERROR)",
                      color: "white",
                      padding: "6px 16px",
                      borderRadius: "32px",
                      fontSize: "1rem",
                      marginRight: "4px",
                    }}
                  >
                    Admin
                  </div>
                </>
              ) : (
                <></>
              )}
              <strong>
                {data?.user.nickname || data?.user.name || "사용자"}
              </strong>
              님 안녕하세요!
            </Garo>
          </div>
          <div className={styles.spacer} />
          {status == "authenticated" && (
            <Link href="/auth/mypage" className={styles.menuLink}>
              마이페이지
            </Link>
          )}
          {status != "loading" && (
            <Link
              href={"/auth/sign" + (status == "authenticated" ? "out" : "in")}
              className={styles.menuLink}
            >
              로그{status == "authenticated" ? "아웃" : "인"}
            </Link>
          )}
          <div className={styles.spacer} />

          {/* 게시판 기능 */}
          <div className={classNames(styles.welcome, styles.void)}>
            <strong>커뮤니티</strong>
          </div>
          <div className={styles.spacer}></div>
          <Link href="/community" className={styles.menuLink}>
            게시판
          </Link>
          {status == "authenticated" && (
            <Link href="/community/new" className={styles.menuLink}>
              글 쓰기
            </Link>
          )}
          <div className={styles.spacer} />

          {/* 부가 서비스 기능 */}
          <div className={classNames(styles.welcome, styles.void)}>
            <strong>부가서비스</strong>
          </div>
          <div className={styles.spacer}></div>
          {status == "authenticated" ? (
            <>
              <Link href="/Additional/food" className={styles.menuLink}>
                우리 학교 급식표
              </Link>
              <div className={styles.spacer}></div>
              <Link href="/Additional/time" className={styles.menuLink}>
                우리 학교 시간표
              </Link>
            </>
          ) : (
            <>
              <a className={styles.menuLink}>로그인 후 이용가능해요.</a>
            </>
          )}
          {/* 관리자 */}
          {data?.user.isAdmin === true ? (
            <>
              <div className={styles.spacer}></div>
              <div className={classNames(styles.welcome, styles.void)}>
                <strong>관리자</strong>
              </div>
              <div className={styles.spacer}></div>{" "}
              <Link href="/admin/user/search" className={styles.menuLink}>
                유저 관리
              </Link>
              <div className={styles.spacer}></div>
              <Link href="/admin/community/search" className={styles.menuLink}>
                커뮤니티 관리
              </Link>
            </>
          ) : (
            <></>
          )}
        </Saero>
      </div>
      <div
        className={classNames(styles.menuBG, optCSS(enabled, styles.enabled))}
      ></div>
    </>
  );
}
