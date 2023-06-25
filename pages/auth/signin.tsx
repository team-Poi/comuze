import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
  return <>Redirecting to Auth0...</>;
}
