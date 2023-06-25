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
          {status != "loading" && status == "authenticated" ? (
            <>
              <div className={styles.welcome}>
                <strong>{data?.user.name}</strong>님 안녕하세요!
              </div>

              <div className={styles.spacer} />

              <Link href="/" className={styles.menuLink}>
                마이페이지
              </Link>
              <Link href="/auth/signout" className={styles.menuLink}>
                로그아웃
              </Link>
              <div className={styles.spacer} />
              <div className={classNames(styles.welcome, styles.void)}>
                <strong>부가서비스</strong>
              </div>
              <div className={styles.spacer}></div>
              <Link href="/" className={styles.menuLink}>
                우리 학교 학사일정
              </Link>
              <div className={styles.spacer}></div>
              <Link href="/" className={styles.menuLink}>
                우리 학교 급식표
              </Link>
              <div className={styles.spacer}></div>
              <Link href="/" className={styles.menuLink}>
                우리 학교 시간표
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.menuLink}>
                로그인
              </Link>
              <div className={styles.spacer} />
              <div className={classNames(styles.welcome, styles.void)}>
                <strong>부가서비스</strong>
              </div>
              <div className={styles.spacer}></div>
              <div className={styles.spacer}>로그인 후 이용 가능합니다</div>
            </>
          )}
        </Saero>
      </div>
      <div
        className={classNames(styles.menuBG, optCSS(enabled, styles.enabled))}
      ></div>
    </>
  );
}
