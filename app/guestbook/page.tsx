import { getGuestbookEntries } from "@/lib/actions";
import GuestbookClient from "./GuestbookClient";

export const metadata = {
  title: "Sổ Lưu Bút Gỗ - VuTriDung",
  description: "Ema Guestbook",
};

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <GuestbookClient initialEntries={entries} />
    </div>
  );
}
