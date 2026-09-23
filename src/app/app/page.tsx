"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WandrApp = dynamic(() => import("@/components/WandrApp"), { ssr: false });

export default function AppPage() {
  const [session, setSession] = useState<any>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      if (!supabase) { setLoading(false); return; }
      setSupabaseClient(supabase);
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        setSession(session);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setSession(session);
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0D2B1D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(248,244,239,0.5)", fontFamily: "system-ui", fontSize: 14 }}>Loading…</p>
    </div>
  );

  return <WandrApp session={session} supabase={supabaseClient} />;
}
