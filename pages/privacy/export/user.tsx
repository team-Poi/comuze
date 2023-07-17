import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/Button";
import { uid } from "uid";
import { Garo } from "@/components/Garo";
import common from "@/styles/common.module.css";

export default function UserDL() {
  const [tempLink, settings] = useState<any>(null);
  useEffect(() => {
    axios.get("/api/export/user").then((e) => {
      if (!e.data.s) return;
      var data = new Blob([JSON.stringify(e.data.data)], { type: "text" });
      var URL = window.URL.createObjectURL(data);
      var tempLink = document.createElement("a");
      tempLink.href = URL;
      tempLink.setAttribute("download", uid(16) + ".json");
      settings(tempLink);
    });
  }, []);
  return (
    <>
      {tempLink ? (
        <Button
          onClick={() => {
            tempLink.click();
          }}
        >
          Download
        </Button>
      ) : (
        <Garo className={common.center}>
          <h2>이런.. 로그인 하지 않은거 같아요! 지금 하러 가볼가요?</h2>
          <Button>로그인</Button>
        </Garo>
      )}
    </>
  );
}
