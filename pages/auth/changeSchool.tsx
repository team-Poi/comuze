import React, { useState, useEffect, useRef } from "react";
import { Input, optCSS } from "@team.poi/ui";
import axios from "axios";
import styles from "@/styles/auth/optionalData.module.css";
import { Saero } from "@/components/Saero";
import { SearchApiResult } from "@/nies/fetchSchool";
import debounceFunction from "@/utils/debounce";
import { toast } from "react-toastify";
import classNames from "@/utils/classNames";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
export function StepTitle({ children }: React.PropsWithChildren<{}>) {
  return <div className={styles.stepTitle}>{children}</div>;
}

export function StepDescription({ children }: React.PropsWithChildren<{}>) {
  return <div className={styles.stepDescription}>{children}</div>;
}

export function SchoolItem({
  item,
  enabled,
  index,
  onClick,
}: {
  item: SearchApiResult;
  enabled: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      className={classNames(styles.fadein, styles.schoolItem)}
      style={{
        opacity: enabled ? "1" : "0",
        animationDuration: `calc(0.3s + 0.05s * ${index})`,
      }}
      onClick={onClick}
    >
      <div>{item.학교명}</div>
      <div className={styles.schoolAdress}>{item.도로번주소}</div>
    </div>
  );
}

function Step1(props: {
  next: () => any;
  setschool: React.Dispatch<React.SetStateAction<SearchApiResult | null>>;
}) {
  const [schoolName, setSchoolName] = useState("");
  const [schoolList, setSchoolList] = useState<SearchApiResult[]>([]);
  const [loading, setLoading] = useState(false);

  const doRequest = (
    query: string,
    callback: (res: SearchApiResult[]) => void
  ) => {
    axios
      .get(`/api/neis/search/school?schoolName=${query}&count=5`)
      .then((v) => {
        if (v.data.data == null) return callback([]);
        callback(v.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const debounceReal = useRef(debounceFunction(doRequest, 200));
  const debouncedSchoolSearch = useRef(
    (query: string, callback: (res: SearchApiResult[]) => void) => {
      debounceReal.current(query, callback);
      setLoading(true);
    }
  ).current;

  useEffect(() => {
    doRequest("", setSchoolList);
  }, []);

  return (
    <div>
      <StepTitle>어디로 등교하세요?</StepTitle>
      <StepDescription>
        급식, 시간표같은 정보를 볼때 사용해요. 다른 학생들에게는 보여지지 않으니
        안심하세요.
      </StepDescription>
      <Input
        placeholder="학교명 검색"
        value={schoolName}
        onChange={(e) => {
          setSchoolName(e.currentTarget.value);
          debouncedSchoolSearch(e.currentTarget.value, setSchoolList);
        }}
        css={{
          margin: "1rem 0px",
        }}
      />
      <Saero
        gap={4}
        className={classNames(
          styles.schoolList,
          optCSS(loading, styles.loading),
          optCSS(loading, "skeleton")
        )}
      >
        {schoolList.map((school, i) => (
          <SchoolItem
            item={school}
            key={i}
            enabled={!loading}
            index={i}
            onClick={() => {
              props.setschool(school);
              props.next();
            }}
          />
        ))}
        {schoolList.length == 0 && (
          <SchoolItem
            item={{
              교육부서: "",
              교육청: "",
              누리집주소: "",
              학교명: "검색결과가",
              도로번주소: "존재하지 않아요",
              설립구분: "",
              시도구분: "",
              전화번호: "",
              지역코드: "",
              학교구분: "",
              학교성별구분: "",
              학교영문명: "",
              학교코드: "",
            }}
            key={0}
            enabled={!loading}
            index={0}
            onClick={() => {}}
          />
        )}
      </Saero>
    </div>
  );
}
function StepEnd() {
  return (
    <div>
      <StepTitle>거의 다 됬어요!</StepTitle>
      <StepDescription>
        서버에 데이터를 저장하는중이에요! 다 저장한후 마이페이지로 이동되요!
      </StepDescription>
    </div>
  );
}

function StepError() {
  return (
    <div>
      <StepTitle>이런...</StepTitle>
      <StepDescription>
        알수없는 오류가 발생했어요. 페이지를 새로고침하거나 브라우저를 재시작
        해보세요!
      </StepDescription>
    </div>
  );
}

function StepWrapper({
  children,
  enabled,
}: React.PropsWithChildren<{ enabled: boolean }>) {
  return (
    <div
      className={styles.stepWrapper}
      style={{
        opacity: enabled ? "1" : "0",
        transform: `translate(-50%, -50%) scale(${
          enabled ? "1" : "0.9"
        }) translateY(${enabled ? "-10px" : "0px"})`,
        pointerEvents: enabled ? "all" : "none",
      }}
    >
      {children}
    </div>
  );
}

export default function Page() {
  let [step, setStep] = useState(1);
  let { update, status } = useSession();

  let [school, setSchool] = useState<SearchApiResult | null>(null);

  let router = useRouter();

  useEffect(() => {
    if (step != 2) return;
    if (!school) return;
    axios
      .post("/api/auth/changeSchool", {
        schoolCode: school.학교코드,
        schoolName: school.학교명,
      })
      .then(({ data }) => {
        if (data.s === true) {
          update().then(() => {
            router.push("/auth/mypage");
          });
        } else {
          toast.error(data.e);
          setStep(-1);
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div style={{}}>
      <StepWrapper enabled={step == -1}>
        <StepError />
      </StepWrapper>
      <StepWrapper enabled={step == 1}>
        <Step1 next={() => setStep(2)} setschool={setSchool} />
      </StepWrapper>
      <StepWrapper enabled={step == 2}>
        <StepEnd />
      </StepWrapper>
      <Link href={"/auth/signout"}>
        <div className={styles.signout}>로그아웃</div>
      </Link>
    </div>
  );
}
