import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else setMessage('✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription.');

      }
    } catch (e) {
      setMessage('Erreur de connexion');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#E50914', letterSpacing: -2, marginBottom: 8 }}>SWAZ</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Votre plateforme de streaming</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.75)', borderRadius: 4, padding: 40 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 24 }}>
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </div>

          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: '100%', background: '#333', border: '1px solid #444', borderRadius: 4, padding: '14px 16px', color: 'white', fontSize: 16, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />

          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            style={{ width: '100%', background: '#333', border: '1px solid #444', borderRadius: 4, padding: '14px 16px', color: 'white', fontSize: 16, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />

          {message && (
            <div style={{ background: 'rgba(229,9,20,0.2)', border: '1px solid #E50914', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#E50914', marginBottom: 16 }}>
              {message}
            </div>
          )}

          <button onClick={handleAuth} disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 4, border: 'none', background: '#E50914', color: 'white', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: 16 }}>
            {loading ? '⏳...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>

          <button onClick={() => setIsLogin(!isLogin)}
            style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>
            {isLogin ? 'Nouveau sur Swaz ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
}
