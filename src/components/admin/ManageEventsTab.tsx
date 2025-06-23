import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ManageEventsTab = ({ events, startEditEvent, deleteEvent }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [signedUpUsers, setSignedUpUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const formatDate = (dateStr: string, timeStr?: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr + (timeStr ? 'T' + timeStr : ''));
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const fetchSignedUpUsers = async (eventId: string) => {
    setLoadingUsers(true);
    setSignedUpUsers([]);
    setSelectedEventId(eventId);
    setShowModal(true);

    try {
      const { data, error } = await supabase
        .from('event_signups')
        .select(`
          id,
          status,
          waiver_submitted,
          user_id,
          event_id,
          created_at,
          user:users (
            id,
            full_name,
            email,
            phone,
            role,
            status
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setSignedUpUsers(data || []);
    } catch (error: any) {
      alert('Failed to load signed up users: ' + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleWaiver = async (signupId: string, current: boolean) => {
    const { error } = await supabase
      .from('event_signups')
      .update({ waiver_submitted: !current })
      .eq('id', signupId);
    if (error) return alert(error.message);
    setSignedUpUsers(prev =>
      prev.map(su =>
        su.id === signupId ? { ...su, waiver_submitted: !current } : su
      )
    );
  };

  const removeSignup = async (signupId: string) => {
    if (!window.confirm('Remove this user from the event?')) return;
    const { error } = await supabase
      .from('event_signups')
      .delete()
      .eq('id', signupId);
    if (error) return alert(error.message);
    setSignedUpUsers(prev => prev.filter(su => su.id !== signupId));
  };

  return (
    <>
      <section className="space-y-4 max-w-4xl mx-auto">
        {events.length === 0 ? (
          <p className="text-gray-600 italic text-center">
            No events created yet. Use the <strong>Create Event</strong> tab to add new events.
          </p>
        ) : (
          events.map((event: any) => (
            <div
              key={event.id}
              className="p-4 bg-white border rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="mb-2 sm:mb-0">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">
                  <p>{formatDate(event.date, event.time)}</p>
                  <p>{event.location}</p>
                  {event.waiver_required && (
                    <p className="text-red-600 font-semibold">Waiver Required</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => startEditEvent(event)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => fetchSignedUpUsers(event.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold"
                >
                  View Users
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-4/5 max-h-[80vh] overflow-y-auto p-6 relative">
            <h2 className="text-2xl font-semibold mb-4">Users Signed Up</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            {loadingUsers ? (
              <p>Loading users...</p>
            ) : signedUpUsers.length === 0 ? (
              <p>No users signed up for this event yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {signedUpUsers.map(signup => {
                  const user = signup.user;
                  return (
                    <li key={signup.id} className="py-3">
                      <p className="font-semibold">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                      <p className="text-xs text-gray-500">
                        {user.role} - {user.status}
                      </p>
                      <p className="text-xs text-gray-400">
                        Signup created: {formatDate(signup.created_at)}
                      </p>

                      <div className="mt-2 flex gap-3 flex-wrap">
                        <button
                          onClick={() => toggleWaiver(signup.id, signup.waiver_submitted)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            signup.waiver_submitted
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-300 text-gray-800'
                          }`}
                        >
                          {signup.waiver_submitted ? 'Waiver Submitted' : 'Waiver Not Submitted'}
                        </button>

                        <button
                          onClick={() => removeSignup(signup.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold"
                        >
                          Remove User
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageEventsTab;
