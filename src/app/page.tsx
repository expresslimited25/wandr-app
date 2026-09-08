"use client";
import dynamic from "next/dynamic";

const WandrApp = dynamic(() => import("@/components/WandrApp"), { ssr: false });

export default function Page() {
  return <WandrApp />;
}
