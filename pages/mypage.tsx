import styles from "@/styles/mypage.module.css";
import { Button } from "@team.poi/ui";
export default function Mypage() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.upper}>
          <h1>마이페이지</h1>
        </div>
        <div className={styles.lower}>
          <div className={styles.btns}>
            <Button color="ERROR" bordered>
              정보수정
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
