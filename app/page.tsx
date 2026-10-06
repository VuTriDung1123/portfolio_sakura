import { getHomePageData } from "@/lib/actions";
import SakuraHomeClient from "./SakuraHomeClient";

// Opt out of static generation to ensure fresh data, or keep it static and use revalidate
export const revalidate = 0; 

export default async function Page() {
  const initialData = await getHomePageData();

  return <SakuraHomeClient initialData={initialData} />;
}
