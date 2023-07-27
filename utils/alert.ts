import prisma from "@/utils/prisma";

const pad2 = (num: number) => {
  return num < 10 ? "0" + num : num;
};

const formatDate = (now: Date) => {
  return `${now.getFullYear()}년 ${pad2(now.getMonth() + 1)}월 ${pad2(
    now.getDate()
  )}일 ${pad2(now.getHours())}시 ${pad2(now.getMinutes())}분 ${pad2(
    now.getSeconds()
  )}초`;
};

export async function sendAlert({
  alertId,
  userId,
  data,
  type,
}: {
  userId: string;
  alertId?: string;
  data: any;
  type: number;
}) {
  try {
    let adata = {};
    if (alertId) {
      adata = {
        id: alertId,
      };
    }
    await prisma.alert.create({
      data: {
        userId: userId,
        type: type,
        data: JSON.stringify(data),
        uploadAt: formatDate(new Date()),
        ...adata,
      },
    });
    return {
      s: true,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}

export async function getAlert({
  alertId,
  type,
}: {
  alertId: string;
  type: number;
}) {
  try {
    let alert = await prisma.alert.findUnique({
      where: {
        id: alertId,
      },
    });
    if (!alert)
      return {
        s: false,
        e: -1,
      };
    let data = JSON.parse(alert.data);
    if (type == 0)
      return {
        s: true,
        title: data.title,
        id: data.id,
      };

    return {
      s: true,
      data: data,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}

export async function deleteAlert({ alertId }: { alertId: string }) {
  try {
    let acnt = await prisma.alert.count({
      where: {
        id: alertId,
      },
    });
    if (!acnt)
      return {
        s: false,
      };
    await prisma.alert.delete({
      where: {
        id: alertId,
      },
    });
    return {
      s: true,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}
