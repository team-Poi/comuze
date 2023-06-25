// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

var KEY = process.env.NEIS_API_KEY;
var INDEX_MAX = process.env.NEIS_SEARCH_RESULT_MAX_COUNT;

export interface NeisAPIResult {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ENG_SCHUL_NM: string;
  SCHUL_KND_SC_NM: string;
  LCTN_SC_NM: string;
  JU_ORG_NM: string;
  FOND_SC_NM: string;
  ORG_RDNZC: string;
  ORG_RDNMA: string;
  ORG_RDNDA: string;
  ORG_TELNO: string;
  HMPG_ADRES: string;
  COEDU_SC_NM: string;
  ORG_FAXNO: string;
  HS_SC_NM: null;
  INDST_SPECL_CCCCL_EXST_YN: string;
  HS_GNRL_BUSNS_SC_NM: string;
  SPCLY_PURPS_HS_ORD_NM: null;
  ENE_BFE_SEHF_SC_NM: string;
  DGHT_SC_NM: string;
  FOND_YMD: string;
  FOAS_MEMRD: string;
  LOAD_DTM: string;
}

export interface SearchApiResult {
  지역코드: string;
  교육청: string;
  학교코드: string;
  학교명: string;
  학교영문명: string;
  학교구분: string;
  시도구분: string;
  교육부서: string;
  설립구분: string;
  도로번주소: string;
  전화번호: string;
  누리집주소: string;
  학교성별구분: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  var { schoolName } = req.query;

  schoolName ||= "";

  try {
    var URL = encodeURI(
      `https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=${INDEX_MAX}&KEY=${KEY}&SCHUL_NM=${schoolName}`
    );
    var { data } = await axios.get(URL);

    res.status(200).json(
      data.schoolInfo[1].row.map((j: NeisAPIResult): SearchApiResult => {
        return {
          지역코드: j.ATPT_OFCDC_SC_CODE,
          교육청: j.ATPT_OFCDC_SC_NM,
          학교코드: j.SD_SCHUL_CODE,
          학교명: j.SCHUL_NM,
          학교영문명: j.ENG_SCHUL_NM,
          학교구분: j.SCHUL_KND_SC_NM,
          시도구분: j.LCTN_SC_NM,
          교육부서: j.JU_ORG_NM,
          설립구분: j.FOND_SC_NM,
          도로번주소: j.ORG_RDNMA,
          전화번호: j.ORG_TELNO,
          누리집주소: j.HMPG_ADRES,
          학교성별구분: j.COEDU_SC_NM,
        };
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ data: null });
  }
}
