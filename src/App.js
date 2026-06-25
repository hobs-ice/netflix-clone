import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Home from './Home';


function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id, session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadProfile(session.user.id, session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId, currentSession) => {
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileData) {
      setProfile(profileData);
    } else {
      const { data: newProfile } = await supabase.from('profiles').insert({
        id: userId,
        email: currentSession?.user?.email,
        trial_started_at: new Date().toISOString(),
      }).select().single();
      setProfile(newProfile);
    }
  };

  if (!session) return <Auth />;

  return <Home session={session} onLogout={() => supabase.auth.signOut()} profile={profile} />;

}

export default App;
