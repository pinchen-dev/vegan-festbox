import { db } from "@/db"
import { notFound } from "next/navigation"
import DesignConfigurator from "./DesignConfigurator"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams

  if (!id || typeof id !== "string") {
    return notFound()
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  })

  if (!configuration || !configuration.imageUrl) {
  return notFound()
}
  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{
        width: configuration.width ?? 0,
        height: configuration.height ?? 0,
      }}
      imageUrl={configuration.imageUrl}
    />
  )
}

export default Page