import { Button } from "@/components/Button";
import styles from "@/styles/components/pbutton.module.css";

export function PButton(props: {
  text: string;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
  fir?: boolean;
  las?: boolean;
}) {
  let color = (props.color || "PRIMARY") as any;
  return (
    <Button
      onClick={props.onClick}
      color={color}
      className={styles.button}
      bordered={props.selected}
      style={{
        borderRadius: props.fir
          ? "8px 0px 0px 8px"
          : props.las
          ? "0px 8px 8px 0px"
          : "0px",
        borderWidth: `2px ${props.las ? 2 : 1}px 2px ${props.fir ? 2 : 1}px`,
        ...(props.las ? {} : { borderRight: "none" }),
      }}
      css={{
        height: "fit-content",
        borderRadius: props.fir
          ? "8px 0px 0px 8px"
          : props.las
          ? "0px 8px 8px 0px"
          : "0px",
      }}
    >
      <span>{props.text}</span>
    </Button>
  );
}
