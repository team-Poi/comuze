import SetState from "@/@types/setState";
import { Garo } from "@/components/Garo";
import { Saero } from "@team.poi/ui";
import { QButton } from "@/components/qbutton";
import common from "@/styles/common.module.css";

function StepTitle({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      style={{
        fontSize: "1.6rem",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

function StepDescription({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      style={{
        opacity: "0.5",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

export function Question(props: {
  setSelected: SetState<number>;
  selected: number;
  title: string;
  desc: string;
}) {
  return (
    <>
      <Saero gap={10} className={common.center}>
        <StepTitle>{props.title}</StepTitle>
        <StepDescription>{props.desc}</StepDescription>
        <Garo gap={5} className={common.center}>
          <p>그렇다</p>
          <QButton
            color="SECONDARY"
            text={props.selected == 1 ? "✓" : ""}
            onClick={() => {
              props.setSelected(1);
            }}
            selected={props.selected == 1 ? true : false}
          />
          <QButton
            color="PRIMARY"
            text={props.selected == 2 ? "✓" : ""}
            onClick={() => {
              props.setSelected(2);
            }}
            selected={props.selected == 2 ? true : false}
          />
          <QButton
            color="INFO"
            text={props.selected == 3 ? "✓" : ""}
            onClick={() => {
              props.setSelected(3);
            }}
            selected={props.selected == 3 ? true : false}
          />
          <QButton
            color="WARNING"
            text={props.selected == 4 ? "✓" : ""}
            onClick={() => {
              props.setSelected(4);
            }}
            selected={props.selected == 4 ? true : false}
          />
          <QButton
            color="ERROR"
            text={props.selected == 5 ? "✓" : ""}
            onClick={() => {
              props.setSelected(5);
            }}
            selected={props.selected == 5 ? true : false}
          />
          <p>그렇지 않다</p>
        </Garo>
      </Saero>
    </>
  );
}
