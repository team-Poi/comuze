import dynamic from "next/dynamic";
import Header from "@/components/Header";
const Button = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Button"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
const Saero = dynamic(() => import("@team.poi/ui/dist/cjs/components/Column"), {
  loading() {
    return <div>Loading...</div>;
  },
});

const FullFlex = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/FullFlex"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "../../styles/error/error.module.css";
import NoSSR from "react-no-ssr";
import { useRouter } from "next/router";
import { Conatiner } from "@team.poi/ui";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

export default function Errors() {
  const router = useRouter();
  return (
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
              어... 없는 페이지에 접근하신거 같아요! {router.query.i}.
            </h1>
            <h2 className={classNames(common.tcenter, common.h2)}>
              Comuze / 학교 생활을 더 즐겁게
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
  );
}
