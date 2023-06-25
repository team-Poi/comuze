import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);
  return <div>Redirecting to Auth0...</div>;
}
