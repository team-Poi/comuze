import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import { Icon } from "@/components/Icon";
import styles from "@/styles/Home.module.css";
export default function Home() {
  return (
    <>
      <Header type="MAIN" />
      <Conatiner className={styles.main}>
        <div className={styles.head}></div>
      </Conatiner>
    </>
  );
}
