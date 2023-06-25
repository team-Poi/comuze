import { Garo } from "@/components/Garo";
import { Loading } from "@/components/Loading";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "@/styles/auth/loader.module.css";

export default function Page() {
  let { status } = useSession();
  let router = useRouter();
  useEffect(() => {
    if (status == "loading") return;
    if (status == "unauthenticated") {
      signIn("auth0");
      return;
    }
    router.push("/");
    return;
  }, [status, router]);
  return (
    <Garo className={styles.loading}>
      <Loading />
    </Garo>
  );
}
