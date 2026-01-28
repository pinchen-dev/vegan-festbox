interface PageProps {
    searchParams: {
    id?: string
  }
}

const Page = async ({ searchParams }: PageProps) => {
    const { id } = await searchParams
    // make db call

    return <p>{id}</p>
}

export default Page