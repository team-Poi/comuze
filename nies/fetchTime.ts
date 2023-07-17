import urlQ from "@/utils/urlQ";
import axios from "axios";

const KEY = process.env.NEIS_API_KEY;

interface RawAPI_Result {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  AY: string;
  SEM: string;
  ALL_TI_YMD: string;
  DGHT_CRSE_SC_NM: string;
  GRADE: string;
  CLASS_NM: string;
  PERIO: string;
  ITRT_CNTNT: string;
  LOAD_DTM: string;
}

type API_Result = string;

const pad2 = (num: number) => {
  return num < 10 ? "0" + num : num;
};

export default async function fetchTime(
  학교코드: string,
  교육청코드: string,
  학년: number,
  반: number,
  학교종류: "중학교" | "초등학교" | "고등학교" | null
) {
  try {
    var now = new Date();
    var nowDayOfWeek = now.getDay();
    var nowDay = now.getDate();
    var startDay = nowDay - nowDayOfWeek + 1;

    const baseURL = `https://open.neis.go.kr/hub/${
      학교종류 == "중학교" ? "mis" : 학교종류 == "고등학교" ? "his" : "els"
    }Timetable`;
    var URL = `${baseURL}?${urlQ({
      ATPT_OFCDC_SC_CODE: 교육청코드,
      SD_SCHUL_CODE: 학교코드,
      KEY: KEY as string,
      TI_FROM_YMD: `${new Date().getFullYear()}${pad2(
        new Date().getMonth() + 1
      )}${pad2(startDay)}`,
      TI_TO_YMD: `${new Date().getFullYear()}${pad2(
        new Date().getMonth() + 1
      )}${pad2(startDay + 4)}`,
      GRADE: 학년,
      CLASS_NM: 반,
      Type: "json",
    })}`;
    var { data } = await axios.get(URL);
    if (data?.RESULT?.MESSAGE == "해당하는 데이터가 없습니다.") return [];
    let pos = -1,
      ldate = "";
    let res: API_Result[][] = [];
    (
      (data.misTimetable || data.hisTimetable || data.elsTimetable)[1]
        .row as RawAPI_Result[]
    )
      .filter(
        (item) =>
          item.CLASS_NM == 반.toString() && item.GRADE == 학년.toString()
      )
      .forEach((item) => {
        if (ldate != item.ALL_TI_YMD) {
          pos++;
          ldate = item.ALL_TI_YMD;
        }
        if (typeof res[pos] == "undefined") res[pos] = [];
        res[pos].push(item.ITRT_CNTNT.replace(/\(.\)/gi, ""));
      });
    res.map((e, i) => {
      for (let j = 0; j < 7 - e.length; j++) {
        e.push("");
      }
    });
    return res;
  } catch (err) {
    return null;
  }
}
