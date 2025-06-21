import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkApproval = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/get-involved?login=true');

      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('id', user.id)
        .single();

      if (error || !data) return navigate('/get-involved?login=true');
      if (data.status !== 'APPROVED') return navigate('/not-approved');

      setApproved(true);
      setLoading(false);
    };

    checkApproval();
  }, []);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#8a9663]">Welcome to your Dashboard</h1>
      <p>hi</p>
    </div>
  );
};

export default Dashboard;
