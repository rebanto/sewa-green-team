import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ManageEventsTab = ({ events, startEditEvent, deleteEvent }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [signedUpUsers, setSignedUpUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(date);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(id);
    }
  };

  // Fetch users signed up for the event
  const fetchSignedUpUsers = async (eventId: string) => {
    setLoadingUsers(true);
    setSignedUpUsers([]);
    setSelectedEventId(eventId);
    setShowModal(true);

    try {
      const { data, error } = await fetchSignedUsersFromSupabase(eventId);
      if (error) throw error;
      setSignedUpUsers(data || []);
    } catch (error: any) {
      alert('Failed to load signed up users: ' + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // This function handles the Supabase query to get users signed up for an event
  // You should replace `event_signups` and field names with your actual table/columns
  async function fetchSignedUsersFromSupabase(eventId: string) {
    // Join event_signups with users table to get full user info
    return await supabase
      .from('event_signups')
      .select(`
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
  }

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
                  <p>{formatDate(event.date)}</p>
                  <p>{event.location}</p>
                  {event.waiver_required && (
                    <p className="text-red-600 font-semibold">Waiver Required</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => startEditEvent(event)}
                  aria-label={`Edit event ${event.title}`}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  aria-label={`Delete event ${event.title}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </button>
                <button
                  onClick={() => fetchSignedUpUsers(event.id)}
                  aria-label={`View users signed up for event ${event.title}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Users
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-4/5 max-h-[80vh] overflow-y-auto p-6 relative"
          >
            <h2 id="modal-title" className="text-2xl font-semibold mb-4">
              Users Signed Up
            </h2>
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
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
                {signedUpUsers.map(({ user }: any) => (
                  <li key={user.id} className="py-3">
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <p className="text-xs text-gray-400">{user.role} - {user.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageEventsTab;
