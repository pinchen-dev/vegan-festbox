import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  // 取得 URL 上的 id (configId)
  const { id } = await searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  // 從資料庫抓取該筆客製化設定
  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  // 渲染第四步的預覽元件，並把資料傳進去
  return <DesignPreview configuration={configuration} />;
};

export default Page;