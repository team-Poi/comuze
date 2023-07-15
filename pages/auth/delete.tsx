import { Garo } from "@/components/Garo";
import { Loading } from "@/components/Loading";
import styles from "@/styles/auth/loader.module.css";
import { signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Delete() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      let x = await axios.post("/api/auth/delete");
      if (x.data.s)
        signOut({
          callbackUrl: "/",
        });
      else {
        alert(x.data.e);
      }
    })();
  }, []);
  return (
    <>
      <Garo className={styles.loading}>
        <Loading />
      </Garo>
    </>
  );
}
