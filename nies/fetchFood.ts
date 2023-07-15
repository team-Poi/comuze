import urlQ from "@/utils/urlQ";
import axios from "axios";

const KEY = process.env.NEIS_API_KEY;

const removeAllergy = (str: string) => {
  return str
    .replace(/([1-9]|1[0-9])\./gi, "")
    .replace(/\([0-9]+\)/gi, "")
    .trim();
};

const pad2 = (num: number) => {
  return num < 10 ? "0" + num : num;
};

export interface RAW_API_RES_ITEM {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string;
  MMEAL_SC_NM: string;
  MLSV_YMD: string;
  MLSV_FGR: number;
  DDISH_NM: string;
  ORPLC_INFO: string;
  CAL_INFO: string;
  NTR_INFO: string;
  MLSV_FROM_YMD: string;
  MLSV_TO_YMD: string;
}

const dateLize = (str: string) => {
  var year = parseInt(str.substring(0, 4));
  var month = parseInt(str.substring(4, 6));
  var day = parseInt(str.substring(6, 8));

  var date = new Date(year, month - 1, day);
  return date.getTime();
};

const date2str = (date: Date) => {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(
    date.getDate()
  )}`;
};

export default async function fetchFood(props: {
  학교코드: string;
  교육청코드: string;
  itemIndex?: number;
}) {
  const now = new Date();
  const nowDayOfWeek = now.getDay();
  const nowDay = now.getDate();
  const startDay = nowDay - nowDayOfWeek + 1;
  const endDay = startDay + 4;

  let url = `https://open.neis.go.kr/hub/mealServiceDietInfo?${urlQ({
    Type: "json",
    KEY: KEY as string,
    MLSV_FROM_YMD: date2str(now),
    MLSV_TO_YMD: date2str(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7)),
    ATPT_OFCDC_SC_CODE: props.교육청코드,
    SD_SCHUL_CODE: props.학교코드,
  })}`;
  let { data } = await axios.get(url);
  if (
    data?.RESULT?.CODE ||
    data?.mealServiceDietInfo[0].head[1]?.RESULT?.CODE != "INFO-000"
  )
    return [];
  return (data?.mealServiceDietInfo[1].row as RAW_API_RES_ITEM[]).map(
    (item) => {
      return {
        음식명: item.DDISH_NM.split("<br/>").map((item) => removeAllergy(item)),
        날짜: dateLize(item.MLSV_YMD),
      };
    }
  );
}
