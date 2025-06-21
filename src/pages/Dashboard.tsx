import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/get-involved?login=true');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('status, full_name, role')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        navigate('/get-involved?login=true');
        return;
      }

      if (data.status !== 'APPROVED') {
        navigate('/not-approved');
        return;
      }

      setUserData(data);
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-[#4d5640]">
        Loading your dashboard...
      </div>
    );
  }

  const { full_name, role } = userData;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-[#8a9663] mb-4">
        Welcome, {full_name} 👋
      </h1>
      <p className="text-[#4d5640] font-medium mb-6">Your role: {role}</p>

      {role === 'ADMIN' && (
        <div className="space-y-4">
          <p className="text-gray-700">You're an admin. Use the tools below:</p>
          <Link
            to="/admin"
            className="inline-block bg-[#8a9663] text-white font-semibold px-5 py-3 rounded-full hover:bg-[#73814f] transition shadow-md"
          >
            Go to Admin Panel
          </Link>
        </div>
      )}

      {role === 'STUDENT' && (
        <p className="text-gray-600">Thanks for signing up! Stay tuned for upcoming events and opportunities.</p>
      )}

      {role === 'PARENT' && (
        <p className="text-gray-600">You're all set. We'll keep you updated on your student’s volunteering.</p>
      )}
    </div>
  );
};

export default Dashboard;
