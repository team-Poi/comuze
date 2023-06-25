import { Loading } from "@/components/Loading";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import styles from "@/styles/auth/loader.module.css";
import { Garo } from "@/components/Garo";

export default function Page() {
  useEffect(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);
  return (
    <Garo className={styles.loading}>
      <Loading />
    </Garo>
  );
}
