import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const WebsiteDetailsTab = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    trash: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('website_details')
        .select('*')
        .single();
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Upsert so it works for both insert and update
    const { error } = await supabase
      .from('website_details')
      .upsert([{ id: 1, ...stats }], { onConflict: 'id' });
    setSaving(false);
    if (error) return alert('Failed to save: ' + error.message);
    alert('Stats updated!');
  };

  if (loading) return <div>Loading website details...</div>;

  return (
    <form onSubmit={handleSave} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow space-y-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#8a9663]">Edit Website Stats</h2>
      <div>
        <label className="block font-semibold mb-1">Volunteers</label>
        <input
          type="number"
          name="volunteers"
          value={stats.volunteers}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={0}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Trash Removed (lbs)</label>
        <input
          type="number"
          name="trash"
          value={stats.trash}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={0}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Events Hosted</label>
        <input
          type="number"
          name="events"
          value={stats.events}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={0}
        />
      </div>
      <button
        type="submit"
        className="bg-[#8a9663] hover:bg-[#6d7a4e] text-white px-6 py-2 rounded-full font-semibold mt-4"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default WebsiteDetailsTab;
