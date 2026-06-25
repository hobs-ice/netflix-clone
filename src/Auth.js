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
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80) center/cover no-repeat', opacity: 0.15 }} />
      
      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, padding: '24px 4vw' }}>
        <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', letterSpacing: '.04em', color: '#e50914' }}>
          CINE<span style={{ color: '#f0f0f0' }}>VAULT</span>
        </div>
      </nav>

      {/* Formulaire */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'rgba(0,0,0,0.82)', border: '1px solid #2a2a2a', borderRadius: 8, padding: '2.5rem', width: '100%', maxWidth: 420 }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', marginBottom: '1.5rem' }}>
            {['login', 'signup'].map(tab => (
              <button key={tab} onClick={() => setIsLogin(tab === 'login')}
                style={{ background: 'none', border: 'none', color: (isLogin ? tab === 'login' : tab === 'signup') ? '#f0f0f0' : '#888', padding: '.6rem 1.2rem', fontSize: '.9rem', fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${(isLogin ? tab === 'login' : tab === 'signup') ? '#e50914' : 'transparent'}`, marginBottom: -1, transition: 'all .2s' }}>
                {tab === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '1.8rem', fontFamily: 'Bebas Neue, serif', letterSpacing: '.04em', marginBottom: '1.5rem' }}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 500, color: '#888', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, color: '#f0f0f0', padding: '.7rem 1rem', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = '#e50914'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 500, color: '#888', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, color: '#f0f0f0', padding: '.7rem 1rem', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = '#e50914'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>

          {message && (
            <div style={{ background: message.includes('✅') ? 'rgba(39,174,96,0.15)' : 'rgba(229,9,20,0.15)', border: `1px solid ${message.includes('✅') ? '#27ae60' : '#e50914'}`, borderRadius: 3, padding: '10px 14px', fontSize: 13, color: message.includes('✅') ? '#27ae60' : '#e50914', marginBottom: 16 }}>
              {message}
            </div>
          )}

          <button onClick={handleAuth} disabled={loading}
            style={{ width: '100%', background: '#e50914', color: '#fff', border: 'none', padding: '.85rem', borderRadius: 3, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'background .2s' }}>
            {loading ? '⏳...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '24px', color: '#888', fontSize: '.8rem' }}>
        © 2026 CineVault. Tous droits réservés.
      </div>
    </div>
  );
}
