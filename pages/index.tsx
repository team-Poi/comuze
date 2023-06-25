import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import styles from "@/styles/Home.module.css";
export default function Home() {
  return (
    <>
      <Header type="MAIN" />
      <Conatiner>
        <div className={styles.uppermain}></div>
        <div className={styles.lowermain}></div>
      </Conatiner>
    </>
  );
}
