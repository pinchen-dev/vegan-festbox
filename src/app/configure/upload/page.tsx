import { Suspense } from "react";
import UploadCard from "./UploadCard";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <UploadCard />
    </Suspense>
  );
};

export default Page;
