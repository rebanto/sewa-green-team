import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import clsx from 'clsx';
import PendingUsersTab from '../components/admin/PendingUsersTab';
import AllUsersTab from '../components/admin/AllUsersTab';
import CreateEventTab from '../components/admin/CreateEventTab';
import ManageEventsTab from '../components/admin/ManageEventsTab';
import WebsiteDetailsTab from '../components/admin/WebsiteDetailsTab';

const tabs = ['Pending Users', 'All Users', 'Create Event', 'Manage Events', 'Website Details'];

const roles = ['ALL', 'STUDENT', 'PARENT', 'ADMIN', 'OTHER']; // adjust based on your roles
const statusOptions = ['ALL', 'APPROVED', 'PENDING', 'REJECTED'];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Pending Users');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [pendingRoleFilter, setPendingRoleFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [pendingStatusFilter, setPendingStatusFilter] = useState('ALL');
  const [eventForm, setEventForm] = useState({
    id: '', // for editing events
    title: '',
    description: '',
    date: '',
    time: '', // new time field
    location: '',
    waiver_required: false,
  });

  const navigate = useNavigate();

  // Helper to format ISO datetime string to YYYY-MM-DD for input type=date
  const formatDateForInput = (isoDateStr: string) => {
    if (!isoDateStr) return '';
    return isoDateStr.split('T')[0];
  };

  // Fetch all necessary data
  const fetchData = async () => {
    const session = await supabase.auth.getUser();
    const user = session.data.user;
    if (!user) return navigate('/get-involved?login=true');

    const { data: currentUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!currentUser || currentUser.role !== 'ADMIN' || currentUser.status !== 'APPROVED') {
      return navigate('/not-allowed');
    }

    const [pendingResp, eventsResp, allUsersResp] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .eq('status', 'PENDING')
        .eq('email_confirmed', true),
      supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true }),
      supabase
        .from('users')
        .select('*')
        .order('full_name', { ascending: true }),
    ]);

    setPendingUsers(pendingResp.data || []);
    setEvents(eventsResp.data || []);
    setAllUsers(allUsersResp.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User approval/reject
  const updateUserStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase.from('users').update({ status }).eq('id', id);
    if (error) return alert(`Error updating user: ${error.message}`);

    setPendingUsers(prev => prev.filter(u => u.id !== id));
    setAllUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
  };

  // Toggle user detail expand
  const toggleExpand = (id: string) => {
    setExpandedUserId(prev => (prev === id ? null : id));
  };

  // Filter users based on role and status
  const filterUsers = (users: any[], roleFilter: string, statusFilter: string) => {
    let filtered = users;
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    return filtered;
  };

  // Event form input handler (supports edit/create)
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  // Create or update event
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventId = eventForm.id ? String(eventForm.id) : '';
    const formattedDate = eventForm.date ? eventForm.date.split('T')[0] : '';
    const eventData = {
      title: eventForm.title,
      description: eventForm.description,
      date: formattedDate,
      time: eventForm.time,
      location: eventForm.location,
      waiver_required: eventForm.waiver_required,
    };
    if (eventId) {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select('*');
      if (error) return alert(error.message);
      if (!data || data.length === 0) alert('No event was updated. Check if the event ID matches the database.');
    } else {
      const { error } = await supabase.from('events').insert(eventData);
      if (error) return alert(error.message);
    }
    setEventForm({ id: '', title: '', description: '', date: '', time: '', location: '', waiver_required: false });
    await fetchData();
    setActiveTab('Manage Events');
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return alert(error.message);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // Populate event form for editing, with fixed date formatting
  const startEditEvent = (event: any) => {
    setEventForm({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDateForInput(event.date),
      time: event.time || '',
      location: event.location,
      waiver_required: event.waiver_required,
    });
    setActiveTab('Create Event');
  };

  // Copy bulk data to clipboard helpers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  // Generate bulk email or phone list based on filters
  const generateBulkList = (field: 'email' | 'phone') => {
    const filtered = filterUsers(allUsers, userRoleFilter, userStatusFilter);
    const list = filtered
      .map(u => u[field])
      .filter(Boolean)
      .join(', ');

    return list;
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading admin panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 mt-24">
      <h1 className="text-4xl font-bold text-[#8a9663] text-center mb-6">Admin Panel</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab}
            className={clsx(
              'px-4 py-2 rounded-full font-semibold transition whitespace-nowrap',
              activeTab === tab
                ? 'bg-[#8a9663] text-white shadow-lg'
                : 'bg-[#dfe5cd] text-[#4d5640] hover:bg-[#cbd6b0]'
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Pending Users' && (
          <PendingUsersTab
            pendingUsers={pendingUsers}
            pendingRoleFilter={pendingRoleFilter}
            setPendingRoleFilter={setPendingRoleFilter}
            pendingStatusFilter={pendingStatusFilter}
            setPendingStatusFilter={setPendingStatusFilter}
            roles={roles}
            statusOptions={statusOptions}
            filterUsers={filterUsers}
            expandedUserId={expandedUserId}
            toggleExpand={toggleExpand}
            updateUserStatus={updateUserStatus}
          />
        )}
        {activeTab === 'All Users' && (
          <AllUsersTab
            allUsers={allUsers}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            userStatusFilter={userStatusFilter}
            setUserStatusFilter={setUserStatusFilter}
            roles={roles}
            statusOptions={statusOptions}
            filterUsers={filterUsers}
            expandedUserId={expandedUserId}
            toggleExpand={toggleExpand}
            copyToClipboard={copyToClipboard}
            generateBulkList={generateBulkList}
          />
        )}
        {activeTab === 'Create Event' && (
          <CreateEventTab
            eventForm={eventForm}
            handleEventChange={handleEventChange}
            saveEvent={saveEvent}
            setEventForm={setEventForm}
          />
        )}
        {activeTab === 'Manage Events' && (
          <ManageEventsTab
            events={events}
            startEditEvent={startEditEvent}
            deleteEvent={deleteEvent}
          />
        )}
        {activeTab === 'Website Details' && (
          <WebsiteDetailsTab />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;