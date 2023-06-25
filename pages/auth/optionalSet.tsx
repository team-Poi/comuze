import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button, optCSS } from "@team.poi/ui";
import axios from "axios";
import styles from "@/styles/auth/optionalData.module.css";
import { Saero } from "@/components/Saero";
import { Garo } from "@/components/Garo";
import { SearchApiResult } from "../api/neis/search/school";
import debounceFunction from "@/utils/debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classNames from "@/utils/classNames";
import { Flex } from "@/components/Flex";
import Router, { useRouter } from "next/router";

interface StepProps {
  next: () => void;
  prv: () => void;
}

function StepTitle({ children }: React.PropsWithChildren<{}>) {
  return <div className={styles.stepTitle}>{children}</div>;
}

function StepDescription({ children }: React.PropsWithChildren<{}>) {
  return <div className={styles.stepDescription}>{children}</div>;
}

function SchoolItem({
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

function Step1(
  props: StepProps & {
    nickname: string;
    setNickname: React.Dispatch<React.SetStateAction<string>>;
  }
) {
  const [Phone, SetPhone] = useState("");
  const next_ = () => {
    if (props.nickname) props.next();
    else {
      toast.error("닉네임을 입력해주세요!");
    }
  };
  return (
    <div>
      <StepTitle>어떻게 부를까요?</StepTitle>
      <StepDescription>
        자신만의 개성넘치는 닉네임을 정해주세요. 다른사람이 볼수있어요!
      </StepDescription>
      <Input
        value={props.nickname}
        onChange={(e) => props.setNickname(e.currentTarget.value)}
        placeholder="닉네임"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            next_();
          }
        }}
        css={{
          margin: "1rem 0px",
        }}
      />
      <Button
        onClick={next_}
        css={{
          margin: "1rem 0px",
        }}
      >
        다음
      </Button>
    </div>
  );
}

function Step2(
  props: StepProps & {
    setschool: React.Dispatch<React.SetStateAction<SearchApiResult | null>>;
  }
) {
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
        callback(v.data);
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
          optCSS(loading, styles.loading)
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
      <Button
        css={{
          margin: "1rem 0px",
        }}
        onClick={props.prv}
      >
        이전
      </Button>
    </div>
  );
}

function Step3(
  props: StepProps & {
    grade: number | null;
    setgrade: React.Dispatch<React.SetStateAction<number | null>>;
    class: number | null;
    setclass: React.Dispatch<React.SetStateAction<number | null>>;

    schoolType?: string;
  }
) {
  const next_ = () => {
    let maxGrade =
      props.schoolType === "고등학교"
        ? 3
        : props.schoolType === "중학교"
        ? 3
        : props.schoolType === "초등학교"
        ? 6
        : 0;
    if (props.grade && props.class) {
      if (props.grade <= 0) return toast.error("학년은 1 이상이여야 해요.");
      if (props.grade > maxGrade)
        return toast.error(`학년은 ${maxGrade} 이하여야 해요.`);
      props.next();
    } else {
      toast.error("학년, 반을 입력해주세요!");
    }
  };
  return (
    <div>
      <StepTitle>어느 학급의 친구들과 함께 있나요?</StepTitle>
      <StepDescription>
        급식, 시간표같은 정보를 볼때 사용해요. 다른 학생들에게는 보여지지 않으니
        안심하세요.
      </StepDescription>
      <Garo gap={4} className={styles.gradeInputs}>
        <Flex>
          <Input
            id="inputa"
            placeholder="학년"
            value={props.grade || ""}
            onChange={(e) => props.setgrade(parseInt(e.currentTarget.value))}
            onKeyPress={(e) => {
              if (e.key === "Enter")
                (document.querySelector("#inputa") as HTMLInputElement)?.blur();
              (document.querySelector("#inputb") as HTMLInputElement)?.focus();
            }}
          />
        </Flex>
        <Flex>
          <Input
            id="inputb"
            placeholder="반"
            value={props.class || ""}
            onChange={(e) => props.setclass(parseInt(e.currentTarget.value))}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                next_();
              }
            }}
          />
        </Flex>
      </Garo>
      <Garo>
        <Button
          css={{
            margin: "1rem 0px",
          }}
          onClick={props.prv}
        >
          이전
        </Button>
        <Button
          css={{
            margin: "1rem 0.5rem",
          }}
          onClick={next_}
        >
          다음
        </Button>
      </Garo>
    </div>
  );
}
function Step4(
  props: StepProps & {
    phone: string;
    setphone: React.Dispatch<React.SetStateAction<string>>;
  }
) {
  return (
    <div>
      <StepTitle>휴대전화를 가지고 계시나요?</StepTitle>
      <StepDescription>
        이것은 선택 사항이며 다른 사람에게 보이지 않아요!
      </StepDescription>
      <Input
        placeholder="전화번호 (선택사항)"
        css={{
          margin: "1rem 0px",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            props.next();
          }
        }}
      />
      <Garo>
        <Button
          css={{
            margin: "1rem 0px",
          }}
          onClick={props.prv}
        >
          이전
        </Button>
        <Button
          css={{
            margin: "1rem 0.5rem",
          }}
          onClick={props.next}
        >
          다음
        </Button>
      </Garo>
    </div>
  );
}

function StepEnd() {
  return (
    <div>
      <StepTitle>거의 다 됬어요!</StepTitle>
      <StepDescription>
        서버에 데이터를 저장하는중이에요! 다 저장한후 메인페이지로 이동되요!
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

  let [school, setSchool] = useState<SearchApiResult | null>(null);
  let [nickname, setNickname] = useState("");
  let [phone, setPhone] = useState("");
  let [grade, setgrade] = useState<number | null>(null);
  let [class_, setClass_] = useState<number | null>(null);

  let router = useRouter();

  const nextStep = () => {
    setStep((j) => {
      router.push(`/auth/optionalSet?step=${j + 1}`);
      return j + 1;
    });
  };

  const prvStep = useCallback(() => {
    setStep((j) => {
      router.push(`/auth/optionalSet?step=${j - 1}`);
      return j - 1;
    });
  }, [router]);
  useEffect(() => {
    (window as any).nextstep = nextStep;
  });
  useEffect(() => {
    window.onpopstate = (e) => {
      e.preventDefault();
      if (step <= 0) router.back();
      else prvStep();
    };
  }, [prvStep, router, router.events, step]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.step) router.replace("/auth/optionalSet?step=1");
    if (router.query.step == "0") {
      router.back();
    }
  }, [router]);

  return (
    <div style={{}}>
      <StepWrapper enabled={step == 1}>
        <Step1
          prv={() => {}}
          next={nextStep}
          nickname={nickname}
          setNickname={setNickname}
        />
      </StepWrapper>
      <StepWrapper enabled={step == 2}>
        <Step2 next={nextStep} prv={prvStep} setschool={setSchool} />
      </StepWrapper>
      <StepWrapper enabled={step == 3}>
        <Step3
          prv={prvStep}
          next={nextStep}
          grade={grade}
          setgrade={setgrade}
          class={class_}
          setclass={setClass_}
          schoolType={school?.학교구분}
        />
      </StepWrapper>
      <StepWrapper enabled={step == 4}>
        <Step4
          next={nextStep}
          phone={phone}
          prv={prvStep}
          setphone={setPhone}
        />
      </StepWrapper>
      <StepWrapper enabled={step == 5}>
        <StepEnd />
      </StepWrapper>
      <ToastContainer />
    </div>
  );
}
