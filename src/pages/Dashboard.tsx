import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [userSignups, setUserSignups] = useState<Record<string, any>>({});
  const [signupLoading, setSignupLoading] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLogoutMessage('Logged out successfully.');
    setTimeout(() => {
      setLogoutMessage('');
      navigate('/');
    }, 1500);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/get-involved?login=true');

      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('status, full_name, role, id')
        .eq('id', user.id)
        .single();

      if (userError || !userInfo) return navigate('/get-involved?login=true');
      if (userInfo.status !== 'APPROVED') return navigate('/not-approved');
      setUserData(userInfo);

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      setEvents(eventData || []);

      const { data: signups } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', user.id);

      const signupMap: Record<string, any> = {};
      (signups || []).forEach(su => {
        signupMap[su.event_id] = su;
      });
      setUserSignups(signupMap);
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleSignUp = async (eventId: string) => {
    setSignupLoading(eventId);
    await supabase.from('event_signups').insert({
      event_id: eventId, user_id: userData.id, status: 'SIGNED_UP', waiver_submitted: false,
    });
    const { data: signups } = await supabase
      .from('event_signups')
      .select('*')
      .eq('user_id', userData.id);
    const signupMap: Record<string, any> = {};
    (signups || []).forEach(su => { signupMap[su.event_id] = su; });
    setUserSignups(signupMap);
    setSignupLoading(null);
  };

  const handleCancelSignup = async (eventId: string) => {
    if (!window.confirm('Cancel your signup for this event?')) return;
    setSignupLoading(eventId);
    await supabase
      .from('event_signups')
      .delete()
      .eq('id', userSignups[eventId].id);
    const { data: signups } = await supabase
      .from('event_signups')
      .select('*')
      .eq('user_id', userData.id);
    const signupMap: Record<string, any> = {};
    (signups || []).forEach(su => { signupMap[su.event_id] = su; });
    setUserSignups(signupMap);
    setSignupLoading(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(ev => ev.date >= todayStr);
  const pastEvents = events.filter(ev => ev.date < todayStr);
  const graphData = [
    { name: 'Week 1', hours: 4 },
    { name: 'Week 2', hours: 9 },
    { name: 'Week 3', hours: 15 },
    { name: 'Week 4', hours: 11 },
    { name: 'Week 5', hours: 20 },
  ];

  if (loading) return <div className="py-32 text-center text-xl text-[#4d5640]">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#f8faf5] py-24 px-4 flex justify-center items-start relative">
      {/* Admin Panel and Log Out Buttons (fixed, stacked, always spaced) */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {userData.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#70923e] hover:bg-[#4f6e2d] text-white px-6 py-3 rounded-full shadow-lg transition w-40"
          >
            Admin Panel
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg transition w-40"
        >
          Log Out
        </button>
      </div>

      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row gap-12">
        {/* LEFT SIDE */}
        <div className="space-y-10 w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-[#b8c19a]">
            <h1 className="text-4xl font-extrabold text-[#4a612c] mb-4">
              {`Hey ${userData.full_name},`}
            </h1>
            <p className="text-lg text-[#6a7c3f] font-medium">
              You're on a mission to save the 🌍 — or at least the local park. Here's your impact.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#b8c19a]">
            <h2 className="text-2xl font-bold text-[#49682d] mb-4">Hours Volunteered (Demo)</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="name" stroke="#73814f" />
                  <YAxis stroke="#73814f" />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#70923e" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-10 w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#b8c19a]">
            <h2 className="text-2xl font-bold text-[#49682d] mb-6">Upcoming Events</h2>
            <ul className="space-y-4">
              {upcomingEvents.map(event => {
                const signedUp = !!userSignups[event.id];
                const waiverDone = signedUp && userSignups[event.id].waiver_submitted;

                return (
                  <li key={event.id} className="bg-[#f5f9e6] p-6 rounded-xl shadow flex justify-between flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div>
                      <p className="font-bold text-[#4a612c] text-xl">{event.title}</p>
                      <p className="text-sm text-[#6b7f46]">{formatDate(event.date)} {event.time && `at ${event.time}`}</p>
                      <p className="text-sm text-[#6b7f46]">{event.location}</p>
                      {event.waiver_required && (
                        <p className="text-xs mt-1 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold w-fit">Waiver Required</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        className="underline text-[#49682d] font-medium"
                      >View</button>
                      {signedUp ? (
                        <>
                          {event.waiver_required && (
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              waiverDone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {waiverDone ? 'Waiver Submitted' : 'Waiver Pending'}
                            </span>
                          )}
                          <button
                            onClick={() => handleCancelSignup(event.id)}
                            disabled={signupLoading === event.id}
                            className="bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-700"
                          >
                            {signupLoading === event.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleSignUp(event.id)}
                          disabled={signupLoading === event.id}
                          className="bg-[#70923e] text-white px-4 py-1.5 rounded-full font-semibold hover:bg-[#4f6e2d]"
                        >
                          {signupLoading === event.id ? 'Signing Up...' : 'Sign Up'}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow border border-[#b8c19a]">
            <h2 className="text-xl font-semibold text-[#49682d] mb-3">Past Events</h2>
            <ul className="text-[#73814f] space-y-1">
              {pastEvents.map(ev => (
                <li key={ev.id} className="text-sm font-medium">
                  {ev.title} — {formatDate(ev.date)} {ev.time ? `at ${ev.time}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[90vw] sm:w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-[#b8c19a]">
            <button onClick={() => setShowEventModal(false)} className="absolute top-4 right-6 text-2xl text-gray-700 hover:text-black font-bold">×</button>
            <h3 className="text-3xl font-serif font-bold text-[#49682d] mb-4">{selectedEvent.title}</h3>
            <p className="text-[#4d5640] mb-3">{selectedEvent.description}</p>
            <p className="text-sm text-gray-600 mb-1">Date: {formatDate(selectedEvent.date)} {selectedEvent.time && `at ${selectedEvent.time}`}</p>
            <p className="text-sm text-gray-600 mb-3">Location: {selectedEvent.location}</p>
            <p className="text-sm font-semibold">Waiver Required: {selectedEvent.waiver_required ? 'Yes' : 'No'}</p>
            <EventSignupCount eventId={selectedEvent.id} />
          </div>
        </div>
      )}
    </div>
  );
};

const EventSignupCount = ({ eventId }: { eventId: string }) => {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('event_signups')
        .select('id', { count: 'exact' })
        .eq('event_id', eventId);
      setCount(count ?? 0);
    };
    fetchCount();
  }, [eventId]);

  return <p className="mt-4 font-semibold text-[#4d5640]">Signed up users: {count ?? 'Loading...'}</p>;
};

export default Dashboard;
