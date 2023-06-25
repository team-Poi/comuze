type HomeType = "MAIN" | "AUTH";

const IconDefine: { [key in HomeType]: string } = {
  MAIN: "error_med",
  AUTH: "key",
};

export default HomeType;
export { IconDefine };
