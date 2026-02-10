import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen text-green-900 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href={"/dashboard"}>Go to dashboard-</Link>
    </div>
  );
}
