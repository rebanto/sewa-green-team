import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [userSignups, setUserSignups] = useState<Record<string, any>>({});
  const [signupLoading, setSignupLoading] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const navigate = useNavigate();

  // Helper: format date + time nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(date);
  };

  // Fetch user info and events + signups
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/get-involved?login=true');
        return;
      }

      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('status, full_name, role, id')
        .eq('id', user.id)
        .single();

      if (userError || !userInfo) {
        navigate('/get-involved?login=true');
        return;
      }

      if (userInfo.status !== 'APPROVED') {
        navigate('/not-approved');
        return;
      }

      setUserData(userInfo);

      // Fetch all upcoming & past events
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventError) {
        alert('Failed to load events: ' + eventError.message);
        setLoading(false);
        return;
      }
      setEvents(eventData || []);

      // Fetch current user's signups
      const { data: signups, error: signupError } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', user.id);

      if (signupError) {
        alert('Failed to load your signups: ' + signupError.message);
        setLoading(false);
        return;
      }

      // Map event_id => signup info for quick lookup
      const signupMap: Record<string, any> = {};
      (signups || []).forEach(su => {
        signupMap[su.event_id] = su;
      });
      setUserSignups(signupMap);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  // Sign up for event
  const handleSignUp = async (eventId: string) => {
    setSignupLoading(eventId);
    try {
      const { data, error } = await supabase.from('event_signups').insert({
        event_id: eventId,
        user_id: userData.id,
        status: 'SIGNED_UP',
        waiver_submitted: false,
      });
      if (error) throw error;
      // Re-fetch signups after sign up
      const { data: signups, error: signupError } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', userData.id);
      if (signupError) throw signupError;
      const signupMap: Record<string, any> = {};
      (signups || []).forEach(su => {
        signupMap[su.event_id] = su;
      });
      setUserSignups(signupMap);
    } catch (error: any) {
      alert('Failed to sign up: ' + error.message);
    } finally {
      setSignupLoading(null);
    }
  };

  // Cancel signup
  const handleCancelSignup = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to cancel your signup for this event?')) return;
    setSignupLoading(eventId);
    try {
      const signup = userSignups[eventId];
      if (!signup) throw new Error('You are not signed up for this event.');

      const { error } = await supabase
        .from('event_signups')
        .delete()
        .eq('id', signup.id);
      if (error) throw error;
      // Re-fetch signups after cancel
      const { data: signups, error: signupError } = await supabase
        .from('event_signups')
        .select('*')
        .eq('user_id', userData.id);
      if (signupError) throw signupError;
      const signupMap: Record<string, any> = {};
      (signups || []).forEach(su => {
        signupMap[su.event_id] = su;
      });
      setUserSignups(signupMap);
    } catch (error: any) {
      alert('Failed to cancel signup: ' + error.message);
    } finally {
      setSignupLoading(null);
    }
  };

  // Open event details modal
  const openEventModal = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Close event modal
  const closeEventModal = () => {
    setSelectedEvent(null);
    setShowEventModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-[#4d5640]">
        Loading your dashboard...
      </div>
    );
  }

  // Split events into upcoming and past (based on date)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(ev => ev.date >= todayStr);
  const pastEvents = events.filter(ev => ev.date < todayStr);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-[#8a9663] mb-4">
        Welcome, {userData.full_name} 👋
      </h1>
      <p className="text-[#4d5640] font-medium mb-6">Your role: {userData.role}</p>

      {userData.role === 'ADMIN' && (
        <div className="space-y-4 mb-8">
          <p className="text-gray-700">You're an admin. Use the tools below:</p>
          <button
            onClick={() => navigate('/admin')}
            className="inline-block bg-[#8a9663] text-white font-semibold px-5 py-3 rounded-full hover:bg-[#73814f] transition shadow-md"
          >
            Go to Admin Panel
          </button>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-600 italic">No upcoming events yet. Check back later!</p>
        ) : (
          <ul className="space-y-4">
            {upcomingEvents.map(event => {
              const signedUp = !!userSignups[event.id];
              const waiverDone = signedUp && userSignups[event.id].waiver_submitted;

              return (
                <li
                  key={event.id}
                  className="p-4 border rounded-md flex justify-between items-center bg-white shadow"
                >
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.date)} {event.time ? `at ${event.time}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    {event.waiver_required && (
                      <p className="text-red-600 font-semibold">Waiver Required</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => openEventModal(event)}
                      className="text-[#8a9663] font-semibold underline"
                    >
                      View Details
                    </button>

                    {signedUp ? (
                      <>
                        {event.waiver_required && (
                          <span
                            className={`text-sm font-semibold ${
                              waiverDone ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {waiverDone ? 'Waiver Submitted' : 'Waiver Pending'}
                          </span>
                        )}
                        <button
                          onClick={() => handleCancelSignup(event.id)}
                          disabled={signupLoading === event.id}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition"
                        >
                          {signupLoading === event.id ? 'Cancelling...' : 'Cancel Signup'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSignUp(event.id)}
                        disabled={signupLoading === event.id}
                        className="bg-[#8a9663] hover:bg-[#73814f] text-white px-4 py-2 rounded-full font-semibold transition"
                      >
                        {signupLoading === event.id ? 'Signing Up...' : 'Sign Up'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="opacity-60">
        <h2 className="text-xl font-semibold mb-2">Past Events</h2>
        {pastEvents.length === 0 ? (
          <p className="italic text-gray-600">No past events.</p>
        ) : (
          <ul className="space-y-2">
            {pastEvents.map(event => (
              <li key={event.id} className="text-gray-600">
                {event.title} — {formatDate(event.date)} {event.time ? `at ${event.time}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="event-modal-title"
          tabIndex={-1}
        >
          <div className="bg-white rounded-lg shadow-lg w-4/5 max-h-[80vh] overflow-y-auto p-6 relative">
            <h2 id="event-modal-title" className="text-2xl font-semibold mb-4">
              {selectedEvent.title}
            </h2>
            <button
              onClick={closeEventModal}
              aria-label="Close event details modal"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <p className="mb-2">{selectedEvent.description}</p>
            <p className="text-sm text-gray-600 mb-1">
              Date: {formatDate(selectedEvent.date)} {selectedEvent.time ? `at ${selectedEvent.time}` : ''}
            </p>
            <p className="text-sm text-gray-600 mb-4">Location: {selectedEvent.location}</p>
            <p>
              <strong>Waiver Required:</strong> {selectedEvent.waiver_required ? 'Yes' : 'No'}
            </p>

            {/* Signup count */}
            <EventSignupCount eventId={selectedEvent.id} />

          </div>
        </div>
      )}
    </div>
  );
};

// Helper component to show signup count for event
const EventSignupCount = ({ eventId }: { eventId: string }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('event_signups')
        .select('id', { count: 'exact' })
        .eq('event_id', eventId);

      if (!error) setCount(count ?? 0);
    };

    fetchCount();
  }, [eventId]);

  return (
    <p className="mt-4 font-semibold text-gray-700">
      Signed up users: {count === null ? 'Loading...' : count}
    </p>
  );
};

export default Dashboard;
