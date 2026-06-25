import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function SerieDetail({ serie, onBack }) {
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [saison, setSaison] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    const { data } = await supabase
      .from('episodes')
      .select('*')
      .eq('serie_id', serie.id)
      .order('saison', { ascending: true })
      .order('numero', { ascending: true });
    setEpisodes(data || []);
  };

  const saisons = [...new Set(episodes.map(e => e.saison))];

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white' }}>
      
      {/* Lecteur vidéo */}
      {currentEpisode && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
              {serie.titre} · S{currentEpisode.saison}E{currentEpisode.numero} · {currentEpisode.titre}
            </div>
            <button onClick={() => setCurrentEpisode(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}>✕</button>
          </div>
          <iframe
            title={currentEpisode.titre}
            src={currentEpisode.video_url}
            style={{ flex: 1, border: 'none', width: '100%' }}
            allowFullScreen
            allow="autoplay"
          />
        </div>
      )}

      {/* Hero */}
      <div style={{ height: '50vh', background: serie.thumbnail_url ? `linear-gradient(to bottom, rgba(0,0,0,0.3), #141414), url(${serie.thumbnail_url}) center/cover` : 'linear-gradient(135deg, #E50914, #831010)', display: 'flex', alignItems: 'flex-end', padding: '0 40px 32px' }}>
        <div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0 }}>← Retour</button>
          <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 8 }}>{serie.titre}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{serie.genre} · {serie.annee} · {saisons.length} saison(s)</div>
          {serie.description && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 8, maxWidth: 600 }}>{serie.description}</div>}
        </div>
      </div>

      {/* Sélecteur de saison */}
      <div style={{ padding: '24px 40px' }}>
        {saisons.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {saisons.map(s => (
              <button key={s} onClick={() => setSaison(s)}
                style={{ background: saison === s ? '#E50914' : '#333', border: 'none', borderRadius: 4, padding: '8px 16px', color: 'white', cursor: 'pointer', fontWeight: saison === s ? 700 : 400 }}>
                Saison {s}
              </button>
            ))}
          </div>
        )}

        {/* Liste épisodes */}
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Saison {saison}</div>
        {episodes.filter(e => e.saison === saison).map(ep => (
          <div key={ep.id} onClick={() => setCurrentEpisode(ep)}
            style={{ display: 'flex', gap: 16, marginBottom: 16, cursor: 'pointer', padding: 12, borderRadius: 4, background: '#1a1a1a' }}
            onMouseEnter={e => e.currentTarget.style.background = '#222'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>
            <div style={{ width: 160, height: 90, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              {ep.thumbnail_url ? (
                <img src={ep.thumbnail_url} alt={ep.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>▶</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>E{ep.numero} · {ep.titre}</div>
              {ep.description && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>{ep.description}</div>}
              {ep.duree && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{ep.duree} min</div>}
            </div>
          </div>
        ))}

        {episodes.filter(e => e.saison === saison).length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Aucun épisode disponible</div>
        )}
      </div>
    </div>
  );
}
