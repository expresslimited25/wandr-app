"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WandrApp = dynamic(() => import("@/components/WandrApp"), { ssr: false });

export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import supabase only on client side
    import("@/lib/supabase").then(({ supabase }) => {
      if (!supabase) {
        // No supabase client — run without auth
        setLoading(false);
        return;
      }
      setSupabaseClient(supabase);

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setSession(session);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }).catch((err) => {
      console.error("Supabase load error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#0e0e0e 0%,#1c1a16 45%,#5a4a2a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(250,250,247,0.6)", fontFamily: "system-ui", fontSize: 14 }}>Loading…</p>
    </div>
  );

  return <WandrApp session={session} supabase={supabaseClient} />;
}
