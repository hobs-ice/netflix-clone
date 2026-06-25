import { useState } from 'react';
import { supabase } from './supabase';

const PRICE_ID = 'price_1TmDLmAkCh9INMBwggM5w85W';
const SUPABASE_URL = 'https://boscpbdfstgbeyzstrmk.supabase.co';

export default function Subscription({ session, onBack }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: PRICE_ID,
          userId: session.user.id,
          email: session.user.email,
          successUrl: window.location.origin + '?premium=success',
          cancelUrl: window.location.origin,
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert('Erreur — réessayez');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#E50914', marginBottom: 8 }}>SWAZ</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Accès illimité</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
          Regardez tous vos films et séries préférés sans limite !
        </div>

        <div style={{ background: '#222', borderRadius: 8, padding: 32, marginBottom: 24 }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#E50914', marginBottom: 8 }}>7,99€</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>par mois · Annulez à tout moment</div>
          
          {['✅ Accès illimité à tous les films', '✅ Qualité HD', '✅ Sans publicité', '✅ Annulation facile'].map((feature, i) => (
            <div key={i} style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 15 }}>{feature}</div>
          ))}
        </div>

        <button onClick={handleSubscribe} disabled={loading}
          style={{ width: '100%', padding: '16px', borderRadius: 4, border: 'none', background: '#E50914', color: 'white', fontWeight: 700, fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: 16 }}>
          {loading ? '⏳...' : '🚀 S\'abonner maintenant'}
        </button>

        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14 }}>
          ← Retour
        </button>
      </div>
    </div>
  );
}
