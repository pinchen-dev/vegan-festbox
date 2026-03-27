import SelectProduct from "./SelectProduct";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams;
  const configId = typeof id === "string" ? id : null;

  return <SelectProduct configId={configId} />;
};

export default Page;