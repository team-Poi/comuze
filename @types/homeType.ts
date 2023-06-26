type HomeType = "MAIN" | "DEBUG";

const IconDefine: { [key in HomeType]: string } = {
  MAIN: "error_med",
  DEBUG: "dns",
};

export default HomeType;
export { IconDefine };
