import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Define Leader type
interface Leader {
  name: string;
  role: string;
  image_url: string;
}

const WebsiteDetailsTab = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    trash: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leadership, setLeadership] = useState<Leader[]>([]);
  const [leadershipLoading, setLeadershipLoading] = useState(true);
  const [leadershipSaving, setLeadershipSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newLeader, setNewLeader] = useState<Leader>({ name: '', role: '', image_url: '' });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('website_details')
        .select('*')
        .single();
      if (data) {
        setStats(data);
        setLeadership(data.leadership || []);
      }
      setLoading(false);
      setLeadershipLoading(false);
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

  // Leadership handlers
  const handleLeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLeader(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('leadership').upload(fileName, file);
    if (error) {
      alert('Image upload failed: ' + error.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('leadership').getPublicUrl(fileName);
    setNewLeader(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
  };

  const handleAddLeader = () => {
    if (!newLeader.name || !newLeader.role || !newLeader.image_url) {
      alert('All fields and image are required.');
      return;
    }
    setLeadership(prev => [...prev, newLeader]);
    setNewLeader({ name: '', role: '', image_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditLeader = (idx: number) => {
    setEditingIndex(idx);
    setNewLeader(leadership[idx]);
  };

  const handleUpdateLeader = () => {
    if (editingIndex === null) return;
    const updated = [...leadership];
    updated[editingIndex] = newLeader;
    setLeadership(updated);
    setEditingIndex(null);
    setNewLeader({ name: '', role: '', image_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteLeader = (idx: number) => {
    if (!window.confirm('Delete this leader?')) return;
    setLeadership(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveLeadership = async () => {
    setLeadershipSaving(true);
    // Save leadership to DB
    const { error } = await supabase
      .from('website_details')
      .update({ leadership })
      .eq('id', 1);
    if (error) {
      setLeadershipSaving(false);
      return alert('Failed to save leadership: ' + error.message);
    }
    // Automated cleanup: delete unused images from bucket
    try {
      // 1. Get all files in the leadership bucket
      const { data: listData, error: listError } = await supabase.storage.from('leadership').list();
      if (!listError && listData) {
        // 2. Get all used image filenames from leadership array
        const usedFiles = new Set(
          leadership
            .map(l => {
              try {
                const url = new URL(l.image_url);
                return url.pathname.split('/').pop();
              } catch {
                return null;
              }
            })
            .filter(Boolean)
        );
        // 3. Delete files not in use
        const unusedFiles = listData
          .filter(file => !usedFiles.has(file.name))
          .map(file => file.name);
        if (unusedFiles.length > 0) {
          await supabase.storage.from('leadership').remove(unusedFiles);
        }
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    setLeadershipSaving(false);
    alert('Leadership updated!');
  };

  if (loading) return <div>Loading website details...</div>;

  return (
    <div>
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

      {/* Leadership Management */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-6 mt-12">
        <h2 className="text-2xl font-bold mb-4 text-[#8a9663]">Manage Leadership</h2>
        {leadershipLoading ? (
          <div>Loading leadership...</div>
        ) : (
          <>
            <ul className="space-y-4">
              {leadership.map((leader, idx) => (
                <li key={idx} className="flex items-center gap-4 border-b pb-4">
                  <img src={leader.image_url} alt={leader.name} className="w-16 h-16 rounded-full object-cover border" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#8a9663]">{leader.name}</div>
                    <div className="text-[#858d6a]">{leader.role}</div>
                  </div>
                  <button onClick={() => handleEditLeader(idx)} className="text-blue-600 font-bold mr-2">Edit</button>
                  <button onClick={() => handleDeleteLeader(idx)} className="text-red-600 font-bold">Delete</button>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h3 className="font-bold mb-2 text-[#8a9663]">{editingIndex !== null ? 'Edit Leader' : 'Add New Leader'}</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newLeader.name}
                onChange={handleLeaderChange}
                className="border rounded px-3 py-2 mr-2 mb-2"
              />
              <input
                type="text"
                name="role"
                placeholder="Role Name"
                value={newLeader.role}
                onChange={handleLeaderChange}
                className="border rounded px-3 py-2 mr-2 mb-2"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="mb-2"
              />
              {newLeader.image_url && (
                <img src={newLeader.image_url} alt="Preview" className="w-16 h-16 rounded-full object-cover inline-block ml-2" />
              )}
              <div className="mt-2">
                {editingIndex !== null ? (
                  <button onClick={handleUpdateLeader} className="bg-blue-600 text-white px-4 py-1 rounded mr-2">Update</button>
                ) : (
                  <button onClick={handleAddLeader} className="bg-green-600 text-white px-4 py-1 rounded mr-2">Add</button>
                )}
                <button onClick={handleSaveLeadership} className="bg-[#8a9663] text-white px-4 py-1 rounded" disabled={leadershipSaving}>
                  {leadershipSaving ? 'Saving...' : 'Save Leadership'}
                </button>
                {editingIndex !== null && (
                  <button onClick={() => { setEditingIndex(null); setNewLeader({ name: '', role: '', image_url: '' }); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="ml-2 text-gray-500">Cancel</button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WebsiteDetailsTab;
