import SetState from "@/@types/setState";
import { Garo } from "@/components/Garo";
import { PButton } from "@/components/pbutton";

export function Pagination(props: {
  count: number;
  maxCount: number;
  value: number;
  setValue: SetState<number>;
}) {
  let elements: any[] = [];
  let st = Math.round(Math.max(props.value - props.count / 2, 1));
  for (let i = st; i <= Math.min(st + props.count - 1, props.maxCount); i++)
    elements.push(
      <PButton
        onClick={() => {
          props.setValue(i);
        }}
        key={i}
        text={`${i}`}
        color="PRIMARY"
        selected={props.value == i ? true : false}
      />
    );
  return (
    <Garo>
      <PButton
        color="PRIMARY"
        text="<"
        onClick={() => {
          props.setValue((dt) => Math.max(dt - 1, 1));
        }}
        selected={false}
        fir
      />
      {elements}
      <PButton
        text=">"
        color="PRIMARY"
        onClick={() => {
          props.setValue((dt) => Math.min(dt + 1, props.maxCount));
        }}
        selected={false}
        las
      />
    </Garo>
  );
}
