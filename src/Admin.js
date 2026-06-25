import { useState } from 'react';
import { supabase } from './supabase';

export default function Admin({ onBack, films = [], onRefresh }) {
  const [editFilm, setEditFilm] = useState(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [annee, setAnnee] = useState('');
  const [duree, setDuree] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const saveFilm = async () => {
    if (!titre || !videoUrl) {
      setMessage('❌ Titre et URL vidéo sont obligatoires');
      return;
    }
    setSaving(true);
    
    const filmData = {
      titre, description, genre,
      annee: annee ? parseInt(annee) : null,
      duree: duree ? parseInt(duree) : null,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
    };

    let error;
    if (editFilm) {
      ({ error } = await supabase.from('films').update(filmData).eq('id', editFilm.id));
    } else {
      ({ error } = await supabase.from('films').insert(filmData));
    }

    if (error) setMessage('❌ Erreur: ' + error.message);
    else {
      setMessage(editFilm ? '✅ Film modifié !' : '✅ Film ajouté !');
      setEditFilm(null);
      setTitre(''); setDescription(''); setGenre('');
      setAnnee(''); setDuree(''); setVideoUrl(''); setThumbnailUrl('');
      onRefresh();
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%',
    background: '#333',
    border: '1px solid #444',
    borderRadius: 4,
    padding: '12px 16px',
    color: 'white',
    fontSize: 14,
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white', padding: 40 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: 24, fontSize: 14 }}>
        ← Retour
      </button>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#E50914' }}>🎬 Ajouter un film</div>

      <div style={{ maxWidth: 600 }}>
        <input style={inputStyle} placeholder="Titre *" value={titre} onChange={e => setTitre(e.target.value)} />
        <textarea style={{ ...inputStyle, height: 100, resize: 'vertical' }} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Genre (ex: Action)" value={genre} onChange={e => setGenre(e.target.value)} />
          <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Année (ex: 2024)" type="number" value={annee} onChange={e => setAnnee(e.target.value)} />
        </div>
        <div style={{ height: 12 }} />
        <input style={inputStyle} placeholder="Durée en minutes (ex: 120)" type="number" value={duree} onChange={e => setDuree(e.target.value)} />
        <input style={inputStyle} placeholder="URL vidéo Bunny.net *" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
        <input style={inputStyle} placeholder="URL thumbnail (image de couverture)" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} />

        {message && (
          <div style={{ background: message.includes('✅') ? 'rgba(39,174,96,0.2)' : 'rgba(229,9,20,0.2)', border: `1px solid ${message.includes('✅') ? '#27ae60' : '#E50914'}`, borderRadius: 4, padding: '10px 14px', fontSize: 13, color: message.includes('✅') ? '#27ae60' : '#E50914', marginBottom: 16 }}>
            {message}
          </div>
        )}

{/* LISTE DES FILMS */}
<div style={{ marginTop: 32 }}>
  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📋 Films existants</div>
  {films.map(film => (
    <div key={film.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', borderRadius: 4, padding: '12px 16px', marginBottom: 8 }}>
      <div>
        <div style={{ fontWeight: 600 }}>{film.titre}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{film.genre} · {film.annee}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          setTitre(film.titre);
          setDescription(film.description || '');
          setGenre(film.genre || '');
          setAnnee(film.annee?.toString() || '');
          setDuree(film.duree?.toString() || '');
          setVideoUrl(film.video_url || '');
          setThumbnailUrl(film.thumbnail_url || '');
          setEditFilm(film);
        }} style={{ background: '#333', border: 'none', borderRadius: 4, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12 }}>
          ✏️ Modifier
        </button>
        <button onClick={async () => {
          if (window.confirm('Supprimer ce film ?')) {
            await supabase.from('films').delete().eq('id', film.id);
            onRefresh();
          }
        }} style={{ background: 'rgba(229,9,20,0.3)', border: 'none', borderRadius: 4, padding: '6px 12px', color: '#E50914', cursor: 'pointer', fontSize: 12 }}>
          🗑️
        </button>
      </div>
    </div>
  ))}
</div>

        <button onClick={saveFilm} disabled={saving}
          style={{ width: '100%', padding: '14px', borderRadius: 4, border: 'none', background: '#E50914', color: 'white', fontWeight: 700, fontSize: 16, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ Enregistrement...' : editFilm ? '✅ Modifier le film' : '✅ Ajouter le film'}
        </button>
      </div>
    </div>
  );
}
