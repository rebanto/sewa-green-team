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
  Legend,
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
  const [volunteerHours, setVolunteerHours] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [graphPeriod, setGraphPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [graphData, setGraphData] = useState<any[]>([]);

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

      // Fetch volunteer hours
      const { data: hoursData } = await supabase
        .from('volunteer_hours')
        .select('event_id, hours, event:events(id, title, date, time)')
        .eq('user_id', user.id);
      setVolunteerHours(hoursData || []);
      setTotalHours((hoursData || []).reduce((sum, h) => sum + (h.hours || 0), 0));

      // Aggregate for graph
      if (hoursData) {
        setGraphData(aggregateHours(hoursData, 'month'));
      }

      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  // Update graph when period or data changes
  useEffect(() => {
    setGraphData(aggregateHours(volunteerHours, graphPeriod));
  }, [volunteerHours, graphPeriod]);

  // Helper to aggregate hours
  function aggregateHours(hoursArr: any[], period: 'week' | 'month' | 'year') {
    if (!hoursArr || hoursArr.length === 0) return [];
    const map: Record<string, number> = {};
    hoursArr.forEach(h => {
      const date = h.event?.date;
      if (!date) return;
      const d = new Date(date);
      let key = '';
      if (period === 'week') {
        // Week of year
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil((((d as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7);
        key = `${d.getFullYear()}-W${week}`;
      } else if (period === 'month') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = `${d.getFullYear()}`;
      }
      map[key] = (map[key] || 0) + (h.hours || 0);
    });
    // Sort keys
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([name, hours]) => ({ name, hours }));
  }

  const handleSignUp = async (eventId: string) => {
    setSignupLoading(eventId);
    await supabase.from('event_signups').insert({
      event_id: eventId, user_id: userData.id, status: 'SIGNED_UP',
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#49682d]">Hours Volunteered</h2>
              <select
                className="border rounded px-2 py-1 text-[#49682d] font-semibold"
                value={graphPeriod}
                onChange={e => setGraphPeriod(e.target.value as any)}
              >
                <option value="week">By Week</option>
                <option value="month">By Month</option>
                <option value="year">By Year</option>
              </select>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="name" stroke="#73814f" />
                  <YAxis stroke="#73814f" allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#70923e" strokeWidth={4} activeDot={{ r: 8 }} />
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

                return (
                  <li key={event.id} className="bg-[#f5f9e6] p-6 rounded-xl shadow flex justify-between flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div>
                      <p className="font-bold text-[#4a612c] text-xl">{event.title}</p>
                      <p className="text-sm text-[#6b7f46]">{formatDate(event.date)} {event.time && `at ${event.time}`}</p>
                      <p className="text-sm text-[#6b7f46]">{event.location}</p>
                      {event.waiver_required && event.waiver_url && event.date >= todayStr && (
                        <>
                          <p className="text-xs mt-1 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold w-fit">Waiver Required</p>
                          <p className="text-xs mt-1 text-red-700 font-semibold">This event requires a signed waiver. <a href={event.waiver_url} download className='underline text-blue-700'>Download Waiver PDF</a> and bring a signed copy in person.</p>
                        </>
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
                        <button
                          onClick={() => handleCancelSignup(event.id)}
                          disabled={signupLoading === event.id}
                          className="bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-700"
                        >
                          {signupLoading === event.id ? 'Cancelling...' : 'Cancel'}
                        </button>
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

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#b8c19a]">
            <h2 className="text-xl font-semibold text-[#49682d] mb-3">Past Events</h2>
            <ul className="text-[#73814f] space-y-1">
              {pastEvents.map(ev => (
                <li key={ev.id} className="text-sm font-medium">
                  {ev.title} — {formatDate(ev.date)} {ev.time ? `at ${ev.time}` : ''}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#b8c19a]">
            <h2 className="text-2xl font-bold text-[#49682d] mb-4">Volunteer Hours (Detailed)</h2>
            {volunteerHours.length === 0 ? (
              <p className="text-gray-500 italic">No volunteer hours recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-[#4d5640]">
                  <thead>
                    <tr className="bg-[#f5f9e6]">
                      <th className="px-4 py-2 text-left">Event</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerHours.map((vh, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{vh.event?.title || '-'}</td>
                        <td className="px-4 py-2">{vh.event?.date ? formatDate(vh.event.date) : '-'}</td>
                        <td className="px-4 py-2">{vh.event?.time || '-'}</td>
                        <td className="px-4 py-2 font-bold">{vh.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#f5f9e6] font-bold">
                      <td className="px-4 py-2" colSpan={3}>Total</td>
                      <td className="px-4 py-2">{totalHours}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
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
            {selectedEvent.waiver_required && selectedEvent.waiver_url && selectedEvent.date >= new Date().toISOString().split('T')[0] && (
              <p className="text-xs mt-1 text-red-700 font-semibold">This event requires a signed waiver. <a href={selectedEvent.waiver_url} download className='underline text-blue-700'>Download Waiver PDF</a> and bring a signed copy in person.</p>
            )}
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

  return <p className="mt-4 font-semibold text-[#4d5640]">Signed up volunteeers: {count ?? 'Loading...'}</p>;
};

export default Dashboard;
