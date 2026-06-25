import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Admin from './Admin';
import SerieDetail from './SerieDetail';
import Subscription from './Subscription';

function FilmCard({ film, onClick, isFavori, onFavori }) {

  return (
    <div className="film-card" onClick={onClick} style={{ position: 'relative', borderRadius: 4, overflow: 'hidden',
 aspectRatio: '2/3', background: '#1a1a1a', cursor: 'pointer', transition: 'transform .25s, box-shadow .25s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.zIndex = 2; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,.7)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 1; e.currentTarget.style.boxShadow = 'none'; }}>
      {film.thumbnail_url ? (
        <img src={film.thumbnail_url} alt={film.titre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e50914, #831010)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 32 }}>🎬</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '0 8px' }}>{film.titre}</span>
        </div>
      )}
            {/* Overlay */}
      <div className="card-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,.9) 0%, transparent 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '.8rem' }}>

        <div style={{ fontWeight: 600, fontSize: '.85rem', marginBottom: '.3rem' }}>{film.titre}</div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {film.genre && <span style={{ fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', background: 'rgba(229,9,20,.8)', color: '#fff', padding: '.15rem .4rem', borderRadius: 2 }}>{film.genre}</span>}
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '.6rem' }}>
          <div onClick={e => { e.stopPropagation(); onClick(); }} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.9)', color: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '.75rem' }}>▶</div>
          {onFavori && (
            <div onClick={e => { e.stopPropagation(); onFavori(); }} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.5)', background: 'rgba(0,0,0,.4)', color: isFavori ? '#e50914' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '.75rem' }}>
              {isFavori ? '♥' : '♡'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function Home({ session, onLogout, profile }) {
  const [films, setFilms] = useState([]);
  const [series, setSeries] = useState([]);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [currentSerie, setCurrentSerie] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('Tout');
  const [favoris, setFavoris] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

const saveHistorique = async (filmId) => {
  const existing = historique.find(h => h.film_id === filmId);
  if (existing) {
    await supabase.from('historique').update({ vu_le: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('historique').insert({
      user_id: session.user.id,
      film_id: filmId,
      progression: 0,
    });
  }
  loadFilms();
};


const toggleFavori = async (film, isSerie = false) => {
  const existing = favoris.find(f => isSerie ? f.serie_id === film.id : f.film_id === film.id);
  if (existing) {
    await supabase.from('favoris').delete().eq('id', existing.id);
    setFavoris(favoris.filter(f => f.id !== existing.id));
  } else {
    const { data } = await supabase.from('favoris').insert({
      user_id: session.user.id,
      ...(isSerie ? { serie_id: film.id } : { film_id: film.id }),
    }).select().single();
    setFavoris([...favoris, data]);
  }
};

  const loadFilms = async () => {
    const { data: filmsData } = await supabase.from('films').select('*').order('created_at', { ascending: false });
    const { data: favorisData } = await supabase.from('favoris').select('*').eq('user_id', session.user.id);
    const { data: historiqueData } = await supabase.from('historique').select('*, films(*)').eq('user_id', session.user.id).order('vu_le', { ascending: false }).limit(10);
    const { data: notifData } = await supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(10);
setNotifications(notifData || []);

setHistorique(historiqueData || []);

setFavoris(favorisData || []);

    const { data: seriesData } = await supabase.from('series').select('*').order('created_at', { ascending: false });
    setFilms(filmsData || []);
    setSeries(seriesData || []);
  };

  useEffect(() => {
  loadFilms();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('premium') === 'success') {
    window.history.replaceState({}, '', window.location.pathname);
    alert('🎉 Bienvenue Premium !');
  }
}, []); // eslint-disable-line


  if (showAdmin) return <Admin onBack={() => setShowAdmin(false)} films={films} onRefresh={loadFilms} />;
  if (showSubscription) return <Subscription session={session} onBack={() => setShowSubscription(false)} />;
  if (currentSerie) return <SerieDetail serie={currentSerie} onBack={() => setCurrentSerie(null)} />;

  const genres = ['Tout', ...new Set([...films, ...series].map(f => f.genre).filter(Boolean))];
  const filteredFilms = films.filter(f =>
    (activeGenre === 'Tout' || f.genre === activeGenre) &&
    (f.titre?.toLowerCase().includes(search.toLowerCase()) || f.genre?.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredSeries = series.filter(s =>
    (activeGenre === 'Tout' || s.genre === activeGenre) &&
    (s.titre?.toLowerCase().includes(search.toLowerCase()) || s.genre?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>

      {/* Lecteur vidéo */}
      {currentFilm && (
        <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 300, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{currentFilm.titre}</div>
            <button onClick={() => setCurrentFilm(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}>✕</button>
          </div>
          <iframe title={currentFilm.titre} src={currentFilm.video_url} style={{ flex: 1, border: 'none', width: '100%' }} allowFullScreen allow="autoplay" />
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4vw', height: 64, background: 'linear-gradient(to bottom, rgba(8,8,8,.95), transparent)', backdropFilter: 'blur(6px)', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', letterSpacing: '.04em', color: '#e50914' }}>CINE<span style={{ color: '#f0f0f0' }}>VAULT</span></div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher..."
          style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 4, padding: '6px 14px', color: 'white', fontSize: 13, outline: 'none', width: 220 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!profile?.is_premium && (
            <button onClick={() => setShowSubscription(true)} style={{ background: '#e50914', border: 'none', borderRadius: 3, padding: '6px 14px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>💎 S'abonner</button>
          )}
          <div style={{ position: 'relative' }}>
  <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: '1px solid rgba(255,255,255,.3)', borderRadius: 3, padding: '6px 10px', color: 'white', cursor: 'pointer', fontSize: 13 }}>
    🔔
    {notifications.filter(n => !n.lu).length > 0 && (
      <span style={{ position: 'absolute', top: -4, right: -4, background: '#e50914', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
        {notifications.filter(n => !n.lu).length}
      </span>
    )}
  </button>
  
  {showNotifications && (
    <div style={{ position: 'absolute', right: 0, top: 40, width: 300, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, zIndex: 200, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>🔔 Notifications</div>
        {notifications.some(n => !n.lu) && (
          <button onClick={async () => {
            await supabase.from('notifications').update({ lu: true }).eq('user_id', session.user.id);
            loadFilms();
          }} style={{ background: 'none', border: 'none', color: '#e50914', cursor: 'pointer', fontSize: 12 }}>
            Tout lire
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>Aucune notification</div>
      ) : (
        notifications.map(n => (
          <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', background: n.lu ? 'transparent' : 'rgba(229,9,20,0.05)' }}>
            <div style={{ fontSize: 13, color: n.lu ? '#888' : '#f0f0f0' }}>{n.message}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
        ))
      )}
    </div>
  )}
</div>

          <button onClick={() => setShowAdmin(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,.3)', borderRadius: 3, padding: '6px 10px', color: 'white', cursor: 'pointer', fontSize: 13 }}>⚙️</button>
          <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,.3)', borderRadius: 3, padding: '6px 10px', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: 13 }}>⏏️</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', height: '92vh', minHeight: 560, display: 'flex', alignItems: 'flex-end', padding: '0 4vw 6vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: films[0]?.thumbnail_url ? `linear-gradient(to right, rgba(8,8,8,.85) 40%, transparent 80%), linear-gradient(to top, rgba(8,8,8,1) 10%, transparent 60%), url(${films[0].thumbnail_url}) center/cover no-repeat` : 'linear-gradient(135deg, #1a0000, #080808)' }} />
        <div style={{ position: 'relative', maxWidth: 560 }}>
          {films[0] && (
            <>
              <span style={{ display: 'inline-block', background: '#e50914', color: '#fff', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '.25rem .6rem', borderRadius: 2, marginBottom: '1rem' }}>🔥 En vedette</span>
              <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: .95, letterSpacing: '.02em', marginBottom: '1.2rem' }}>{films[0].titre}</div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '.8rem', color: '#888', marginBottom: '1rem' }}>
                {films[0].annee && <span>{films[0].annee}</span>}
                {films[0].duree && <span>{films[0].duree} min</span>}
                {films[0].genre && <span>{films[0].genre}</span>}
              </div>
              {films[0].description && <p style={{ fontSize: '.95rem', color: '#bbb', maxWidth: 420, marginBottom: '2rem', lineHeight: 1.7 }}>{films[0].description}</p>}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setCurrentFilm(films[0])} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', background: '#f0f0f0', color: '#080808', border: 'none', padding: '.75rem 1.8rem', borderRadius: 3, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer' }}>▶ Regarder</button>
                <button style={{ background: 'rgba(255,255,255,.15)', color: '#f0f0f0', border: '1px solid rgba(255,255,255,.2)', padding: '.75rem 1.8rem', borderRadius: 3, fontSize: '.95rem', fontWeight: 600, cursor: 'pointer' }}>ℹ Plus d'infos</button>
              </div>
            </>
          )}
          {films.length === 0 && series.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
              <div style={{ fontSize: 20, color: '#888' }}>Aucun contenu disponible</div>
            </div>
          )}
        </div>
      </div>

      {/* GENRES */}
      <div style={{ padding: '0 4vw', marginBottom: '2rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        {genres.map(g => (
          <button key={g} onClick={() => setActiveGenre(g)}
            style={{ background: activeGenre === g ? '#e50914' : '#1a1a1a', color: activeGenre === g ? '#fff' : '#888', border: `1px solid ${activeGenre === g ? '#e50914' : '#2a2a2a'}`, padding: '.4rem 1rem', borderRadius: 20, fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>
            {g}
          </button>
        ))}
      </div>

      {/* FILMS */}
      {filteredFilms.length > 0 && (
        <section style={{ padding: '1rem 4vw 2rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.6rem', letterSpacing: '.06em', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            🎬 Films
            <span style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {filteredFilms.map(film => (

<FilmCard key={film.id} film={film} onClick={() =>  { setCurrentFilm(film); saveHistorique(film.id); }
}

    isFavori={favoris.some(f => f.film_id === film.id)}
    onFavori={() => toggleFavori(film, false)} />
))}

          </div>
        </section>
      )}

      {/* SÉRIES */}
      {filteredSeries.length > 0 && (
        <section style={{ padding: '1rem 4vw 2rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.6rem', letterSpacing: '.06em', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            📺 Séries
            <span style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {filteredSeries.map(serie => (
  <FilmCard key={serie.id} film={serie} onClick={() => setCurrentSerie(serie)}
    isFavori={favoris.some(f => f.serie_id === serie.id)}
    onFavori={() => toggleFavori(serie, true)} />
))}

          </div>
        </section>
      )}
{historique.length > 0 && (
  <section style={{ padding: '1rem 4vw 2rem' }}>
    <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.6rem', letterSpacing: '.06em', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
      🕐 Continuer à regarder
      <span style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
      {historique.map(h => {
        const film = h.films;
        if (!film) return null;
        return <FilmCard key={h.id} film={film} onClick={() => { setCurrentFilm(film); saveHistorique(film.id); }}
          isFavori={favoris.some(f => f.film_id === film.id)}
          onFavori={() => toggleFavori(film, false)} />;
      })}
    </div>
  </section>
)}


      {favoris.length > 0 && (
  <section style={{ padding: '1rem 4vw 2rem' }}>
    <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.6rem', letterSpacing: '.06em', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
      ♥ Ma liste
      <span style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
      {favoris.map(fav => {
        const film = fav.film_id ? films.find(f => f.id === fav.film_id) : series.find(s => s.id === fav.serie_id);
        if (!film) return null;
        return <FilmCard key={fav.id} film={film} onClick={() => fav.film_id ? setCurrentFilm(film) : setCurrentSerie(film)}
          isFavori={true}
          onFavori={() => toggleFavori(film, !!fav.serie_id)} />;
      })}
    </div>
  </section>
)}


      {/* BANNER CTA */}
      {!profile?.is_premium && (
        <div style={{ margin: '2rem 4vw', borderRadius: 6, background: 'linear-gradient(135deg, #9b0a10, #3a0a0e)', border: '1px solid #9b0a10', padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', letterSpacing: '.04em', marginBottom: '.4rem' }}>Accès illimité dès 9,99€/mois</div>
            <p style={{ color: '#ccc', fontSize: '.9rem' }}>Annulez à tout moment. Aucun engagement. Streaming HD inclus.</p>
          </div>
          <button onClick={() => setShowSubscription(true)} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '.85rem 2.2rem', borderRadius: 3, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Commencer maintenant →
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #2a2a2a', padding: '3rem 4vw', color: '#888', fontSize: '.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.2rem', color: '#e50914' }}>CINE<span style={{ color: '#f0f0f0' }}>VAULT</span></div>
          <span>© 2026 CineVault. Tous droits réservés.</span>
        </div>
      </footer>

      <style>{`
  .card-overlay { opacity: 0; transition: opacity .25s; }
  .film-card:hover .card-overlay { opacity: 1; }
`}</style>


    </div>
  );
}
