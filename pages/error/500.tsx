import { Conatiner } from "@/components/Container";
import common from "../../styles/error/error.module.css";
import NoSSR from "react-no-ssr";
import classNames from "@/utils/classNames";
import Header from "@/components/Header";
import { Button } from "@/components/Button";
import { Saero } from "@/components/Saero";
import { FullFlex } from "@/components/FullFlex";
import { useRouter } from "next/router";
import { Garo } from "@/components/Garo";

/* 심각한 에러 발생시 사용 */

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
                알수없는 오류가 발생했어요.
              </h1>
              <h2 className={classNames(common.tcenter, common.h2)}>
                추가 문제 발생을 방지하기위해 로그아웃 하는것을 추천해요.
              </h2>
              <div className={common.tcenter}>
                <Garo gap={5}>
                  <Button
                    style={{
                      padding: "8px 36px",
                    }}
                    color="INFO"
                    bordered
                    onClick={() => router.push("/auth/signout")}
                  >
                    로그아웃
                  </Button>
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
                </Garo>
              </div>
            </Saero>
          </Conatiner>
        </FullFlex>
      </Saero>
    </>
  );
}
