import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseConnection.js";
 
const SessionContext = createContext(null);
 
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // Check for an existing session on app open
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
 
    // Keep session in sync for login, logout, and token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
 
    return () => subscription.unsubscribe();
  }, []);
 
  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
}
 
// Call this hook in any screen to read the session
// e.g. const { session, loading } = useSession();
export function useSession() {
  return useContext(SessionContext);
}