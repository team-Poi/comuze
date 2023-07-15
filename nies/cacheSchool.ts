import fetchSchool from "./fetchSchool";
import prisma from "@/utils/prisma";

export default async function cacheSchools(schoolName: string) {
  let fetchedSchool = await fetchSchool(schoolName);
  if (!fetchedSchool) return;
  await prisma.school.createMany({
    skipDuplicates: true,
    data: fetchedSchool.map((j) => {
      return {
        address: j.도로번주소,
        areaCode: j.지역코드,
        city: j.시도구분,
        eduDiv: j.설립구분,
        genderDiv: j.학교성별구분,
        id: j.학교코드,
        office: j.교육부서,
        phoneNumber: j.전화번호,
        releaseType: j.설립구분,
        schoolEngName: j.학교영문명,
        schoolName: j.학교명,
        schoolType: j.학교구분,
        url: j.누리집주소,
      };
    }),
  });
}
