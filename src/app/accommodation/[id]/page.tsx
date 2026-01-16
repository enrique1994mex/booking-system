import { AccommodationPage } from "@/ui/pages/AccommodationPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AccommodationPage id={id} />; 
}