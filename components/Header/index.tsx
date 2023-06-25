import { Icon } from "../Icon";
import { Garo } from "../Garo";
import optCSS from "@/utils/optCSS";
import classNames from "@/utils/classNames";
import styles from "./style.module.css";
import HomeType, { IconDefine } from "@/@types/homeType";
import Link from "next/link";
import CONSTANTS from "@/constants";

interface HeaderProps {
  type?: HomeType;
  href?: string;
  featureType?: string;
}

export default function Header(props: HeaderProps) {
  return (
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
            color: props.type == "MAIN" ? "var(--POI-UI-PRIMARY)" : "black",
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
      <Garo gap={6}></Garo>
    </header>
  );
}
