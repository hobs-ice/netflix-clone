import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Admin from './Admin';
import Subscription from './Subscription';


function FilmCard({ film, onClick }) {
  return (
    <div onClick={onClick} style={{ borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      {film.thumbnail_url ? (
        <img src={film.thumbnail_url} alt={film.titre} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg, #E50914, #831010)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexDirection: 'column', gap: 8 }}>
          <span>🎬</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{film.titre}</span>
        </div>
      )}
      <div style={{ padding: '8px 0' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{film.titre}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{film.genre} · {film.annee}</div>
      </div>
    </div>
  );
}

export default function Home({ session, onLogout, profile }) {

  const [films, setFilms] = useState([]);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [showSubscription, setShowSubscription] = useState(false);




 const loadFilms = async () => {
  const { data } = await supabase.from('films').select('*').order('created_at', { ascending: false });
  setFilms(data || []);
};

useEffect(() => {
  loadFilms();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('premium') === 'success') {
    window.history.replaceState({}, '', window.location.pathname);
    alert('🎉 Bienvenue Premium !');
  }
}, []);


if (showAdmin) return <Admin onBack={() => setShowAdmin(false)} films={films} onRefresh={loadFilms} />;
if (showSubscription) return <Subscription session={session} onBack={() => setShowSubscription(false)} />;

  return (
    
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white' }}>
      
      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.95)', zIndex: 100, boxSizing: 'border-box', flexWrap: 'wrap', gap: 8 }}>
  <div style={{ fontSize: 24, fontWeight: 900, color: '#E50914', letterSpacing: -1 }}>SWAZ</div>
  <input 
    value={search} 
    onChange={e => setSearch(e.target.value)}
    placeholder="🔍 Rechercher..."
    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '6px 12px', color: 'white', fontSize: 13, outline: 'none', flex: 1, minWidth: 120, maxWidth: 250 }}
  />
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    {!profile?.is_premium && (
      <button onClick={() => setShowSubscription(true)} style={{ background: '#E50914', border: 'none', borderRadius: 4, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
        💎
      </button>
    )}
    <button onClick={() => setShowAdmin(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '6px 10px', color: 'white', cursor: 'pointer', fontSize: 12 }}>
      ⚙️
    </button>
    <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '6px 10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12 }}>
      ⏏️
    </button>
  </div>
</nav>

      {currentFilm && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
      <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{currentFilm.titre}</div>
      <button onClick={() => setCurrentFilm(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}>✕</button>
    </div>
    <iframe
      title={currentFilm.titre}
      src={currentFilm.video_url}
      style={{ flex: 1, border: 'none', width: '100%' }}
      allowFullScreen
      allow="autoplay"
    />

  </div>
)}


      {/* HERO */}
       <div style={{ height: '80vh', 
  background: films[0]?.thumbnail_url 
    ? `linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent), linear-gradient(to top, #141414 5%, transparent), url(${films[0].thumbnail_url}) center/cover no-repeat`
    : 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent), linear-gradient(to top, #141414 5%, transparent)', display: 'flex', alignItems: 'center', padding: '0 16px', paddingTop: 80
 }}>
        {films[0] ? (
          <div>
            <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, maxWidth: 600 }}>{films[0].titre}</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 500, lineHeight: 1.6, marginBottom: 24 }}>{films[0].description}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setCurrentFilm(films[0])} style={{ background: 'white', border: 'none', borderRadius: 4, padding: '12px 28px', color: 'black', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
  ▶ Lecture
</button>

                
              
              <button style={{ background: 'rgba(109,109,110,0.7)', border: 'none', borderRadius: 4, padding: '12px 28px', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                ℹ Plus d'infos
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>Aucun film disponible</div>
          </div>
        )}
      </div>

      {/* CATÉGORIES */}
<div style={{ padding: '0 40px 40px' }}>
  {search ? (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🔍 Résultats pour "{search}"</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {films.filter(f => 
          f.titre?.toLowerCase().includes(search.toLowerCase()) || 
          f.genre?.toLowerCase().includes(search.toLowerCase())
        ).map(film => <FilmCard key={film.id} film={film} onClick={() => setCurrentFilm(film)} />)}
      </div>
    </div>
  ) : (
    <>
      {/* Tous les films */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🎬 Tous les films</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {films.map(film => <FilmCard key={film.id} film={film} onClick={() => setCurrentFilm(film)} />)}
        </div>
      </div>

      {/* Par genre */}
      {[...new Set(films.map(f => f.genre).filter(Boolean))].map(genre => (
        <div key={genre} style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🎭 {genre}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {films.filter(f => f.genre === genre).map(film => <FilmCard key={film.id} film={film} onClick={() => setCurrentFilm(film)} />)}
          </div>
        </div>
      ))}
    </>
  )}
</div>
    </div>
  );
}
