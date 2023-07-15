import { Button } from "@/components/Button";
import styles from "@/styles/components/pbutton.module.css";

export function QButton(props: {
  text: string;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  let color = (props.color || "PRIMARY") as any;
  return (
    <Button
      onClick={props.onClick}
      color={color}
      className={styles.button}
      bordered={props.selected}
    >
      <span>{props.text}</span>
    </Button>
  );
}
