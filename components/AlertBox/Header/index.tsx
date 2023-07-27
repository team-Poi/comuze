import styles from "./style.module.css";

export default function Header() {
  return (
    <div className={styles.head}>
      <strong>
        <h3 className={styles.title}>알림</h3>
      </strong>
    </div>
  );
}
