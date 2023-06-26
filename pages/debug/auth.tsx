import { Conatiner } from "@/components/Container";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import styles from "@/styles/authData.module.css";

export default function Page() {
  let { data, status } = useSession();

  return (
    <div>
      <Header featureType="debug" type="DEBUG" />
      <Conatiner>
        <div className={styles.section}>
          <h2>Authenticated</h2>
          <div>
            {status == "authenticated"
              ? "Yes"
              : status == "loading"
              ? "Loading..."
              : "No"}
          </div>
        </div>
        {data?.expires && (
          <div className={styles.section}>
            <h2>Session expires</h2>
            <div>{data.expires}</div>
          </div>
        )}
        <div className={styles.section}>
          <h2>User info</h2>
          {data?.user.id && (
            <div className={styles.section}>
              <h2>User id</h2>
              <div>{data.user.id}</div>
            </div>
          )}

          {data?.user.name && (
            <div className={styles.section}>
              <h2>User name</h2>
              <div>{data.user.name}</div>
            </div>
          )}
          {data?.user.nickname && (
            <div className={styles.section}>
              <h2>Nickname</h2>
              <div>{data.user.nickname}</div>
            </div>
          )}

          {data?.user.image && (
            <div className={styles.section}>
              <h2>User icon</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data?.user.image}
                style={{
                  border: "1px solid var(--nextui-colors-border)",
                  padding: "6px",
                  borderRadius: "6px",
                }}
                alt="User icon"
                width={128}
                height={128}
              />
            </div>
          )}
          {data?.user.email && (
            <div className={styles.section}>
              <h2>User email</h2>
              <div>{data.user.email}</div>
            </div>
          )}

          {data?.user.age && (
            <div className={styles.section}>
              <h2>User age</h2>
              <div>{data.user.age}</div>
            </div>
          )}
          <div className={styles.section}>
            <h2>Is admin</h2>
            <div>{data?.user.isAdmin ? "Yes" : "No"}</div>
          </div>
          {data?.user.school && (
            <div className={styles.section}>
              <h2>User school</h2>
              <div>{data.user.school}</div>
            </div>
          )}
          {data?.user.classNumber && (
            <div className={styles.section}>
              <h2>Class number</h2>
              <div>{data.user.classNumber}</div>
            </div>
          )}
        </div>
      </Conatiner>
    </div>
  );
}
