import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingUsers = async () => {
    const session = await supabase.auth.getUser();
    const user = session.data.user;

    if (!user) {
      navigate('/get-involved?login=true');
      return;
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!currentUser || currentUser.role !== 'ADMIN' || currentUser.status !== 'APPROVED') {
      navigate('/not-allowed');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'PENDING');

    if (error) console.error('Error fetching users:', error.message);
    else setPendingUsers(data || []);

    setLoading(false);
  };

  const updateUserStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(`Error updating user: ${error.message}`);
    } else {
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) return <div className="text-center py-20 text-lg">Loading admin panel...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-[#8a9663] mb-8 text-center">Admin Panel</h1>
      {pendingUsers.length === 0 ? (
        <p className="text-center text-gray-600">No pending users 🎉</p>
      ) : (
        <div className="space-y-6">
          {pendingUsers.map(user => (
            <div key={user.id} className="p-6 bg-white border border-[#d8dccb] rounded-xl shadow-sm">
              <div className="mb-2 font-semibold text-lg">{user.full_name}</div>
              <div className="text-sm text-gray-600">
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Role: {user.role}</p>
                <p>Lead ID: {user.lead_id}</p>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => updateUserStatus(user.id, 'APPROVED')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateUserStatus(user.id, 'REJECTED')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;