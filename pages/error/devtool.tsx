import { Conatiner } from "@/components/Container";
import common from "../../styles/error/error.module.css";
import NoSSR from "react-no-ssr";
import classNames from "@/utils/classNames";
import Header from "@/components/Header";
import { Button } from "@/components/Button";
import { Saero } from "@/components/Saero";
import { FullFlex } from "@/components/FullFlex";
import { useRouter } from "next/router";

/* 빌드시 사용(Dev에서 쓸거 아님) */

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

export default function Devtool() {
  const router = useRouter();
  return (
    <>
      <Saero className={common.w100}>
        <Header type="MAIN" />
        <FullFlex className={common.w100}>
          <Conatiner>
            <Saero className={classNames(common.w100, common.centerFlex)}>
              <NoSSR>
                <div className={classNames(common.errorFace, common.tcenter)}>
                  {words[Math.floor(Math.random() * words.length)]}
                </div>
              </NoSSR>
              <h1 className={classNames(common.tcenter, common.h1)}>
                부정행위를 감지했어요.
              </h1>
              <h2 className={classNames(common.tcenter, common.h2)}>
                Devtool 사용은 금지되어있어요.
              </h2>
              <div className={common.tcenter}>
                <Button
                  style={{
                    padding: "8px 36px",
                  }}
                  color="INFO"
                  bordered
                  onClick={() => router.push("/")}
                >
                  돌아가기
                </Button>
              </div>
            </Saero>
          </Conatiner>
        </FullFlex>
      </Saero>
    </>
  );
}
