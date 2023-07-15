import { Question } from "@/components/Question";
import Head from "next/head";
import { useState } from "react";
import NoSSR from "react-no-ssr";
import { uid } from "uid";

function randStr() {
  let g: string[] = [];
  for (let i = 0; i < 4; i++) g.push(uid(8));
  return g.join(" ");
}

export default function Page() {
  const [selected, setSelected] = useState(1);
  let elements: any[] = [];
  for (let i = 0; i < 100; i++)
    elements.push(
      <Question
        setSelected={(v) => {}}
        selected={Math.floor(Math.random() * 5) + 1}
        title={randStr()}
        desc={randStr()}
      />
    );
  return (
    <>
      <NoSSR>
        <Question
          setSelected={setSelected}
          selected={selected}
          title={"Fixed question"}
          desc={randStr()}
        />
        {elements}
      </NoSSR>
    </>
  );
}
