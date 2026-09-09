"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const WandrApp = dynamic(() => import("@/components/WandrApp"), { ssr: false });

export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#0e0e0e 0%,#1c1a16 45%,#5a4a2a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(250,250,247,0.6)", fontFamily: "system-ui", fontSize: 14 }}>Loading…</p>
    </div>
  );

  return <WandrApp session={session} supabase={supabase} />;
}
