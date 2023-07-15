import { Button } from "@/components/Button";
import Header from "@/components/Header";
import { Question as QuestionComponent } from "@/components/Question";
import { Saero } from "@/components/Saero";
import { useState } from "react";
import NoSSR from "react-no-ssr";

interface Question {
  question: string;
  desc: string;
}

interface QuestionSet {
  question: Question;
  ans: number;
}

export default function Test() {
  let [questions, setQuestions] = useState<QuestionSet[]>([
    {
      ans: 1,
      question: {
        question: "11111",
        desc: "11111",
      },
    },
    {
      ans: 1,
      question: {
        question: "11111",
        desc: "11111",
      },
    },
    {
      ans: 1,
      question: {
        question: "11111",
        desc: "11111",
      },
    },
  ]);
  return (
    <>
      <NoSSR>
        <Header />
        <Saero gap={25}>
          {questions.map((e, i) => (
            <QuestionComponent
              key={i}
              title={e.question.question}
              desc={e.question.desc}
              selected={e.ans}
              setSelected={(s) => {
                setQuestions((oldQues) =>
                  oldQues.map((ques, ix) => {
                    if (ix != i) return ques;
                    ques.ans = parseInt(s.toString());
                    return ques;
                  })
                );
              }}
            />
          ))}
          <Button onClick={() => {}}>제출</Button>
        </Saero>
      </NoSSR>
    </>
  );
}
