import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/auth/AuthContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { X, Calendar, MapPin, FileText, Clock } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [userSignups, setUserSignups] = useState<Record<string, any>>({});
  const [signupLoading, setSignupLoading] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [volunteerHours, setVolunteerHours] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [graphPeriod, setGraphPeriod] = useState<"week" | "month" | "year">("week");
  const [graphData, setGraphData] = useState<any[]>([]);

  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "No date";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleLogout = async () => {
    await signOut();
    setLogoutMessage("Logged out successfully.");
    setTimeout(() => {
      setLogoutMessage("");
      navigate("/");
    }, 1500);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to be ready
      if (authLoading) return;

      // If no user, let the AuthRedirect handle navigation
      if (!user) return;

      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("status, full_name, role, id")
        .eq("id", user.id)
        .single();

      if (userError || !userInfo) return navigate("/get-involved?login=true");
      if (userInfo.status !== "APPROVED") return navigate("/not-approved");
      setUserData(userInfo);

      // Get all files once to avoid repeated API calls
      try {
        // Get all events
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (eventError) throw eventError;

        if (!eventData || eventData.length === 0) {
          setEvents([]);
          return;
        }

        // Get all images from storage
        const { data: allImages, error: imageError } = await supabase.storage
          .from("events")
          .list("images", { limit: 1000 });

        if (imageError) throw imageError;

        // Create image map for efficient lookup
        const imageMap = new Map(allImages.map((image) => [image.id, image]));

        // Merge events with their corresponding images
        const eventsWithImages = eventData.map((event) => {
          if (!event.image_id || !imageMap.has(event.image_id)) {
            return {
              ...event,
              image: null,
              imageUrl: null,
            };
          }

          const image = imageMap.get(event.image_id);
          const {
            data: { publicUrl },
          } = supabase.storage.from("events/images").getPublicUrl(image!.name);

          return {
            ...event,
            image,
            imageUrl: publicUrl,
          };
        });

        console.log("Events with images:", eventsWithImages);
        setEvents(eventsWithImages || []);
      } catch (error) {
        console.error("Error fetching events with images:", error);
        setEvents([]);
      }

      const { data: signups } = await supabase
        .from("event_signups")
        .select("*")
        .eq("user_id", user.id);

      const signupMap: Record<string, any> = {};
      (signups || []).forEach((su) => {
        signupMap[su.event_id] = su;
      });
      setUserSignups(signupMap);

      // Fetch volunteer hours
      const { data: hoursData } = await supabase
        .from("volunteer_hours")
        .select("event_id, hours, event:events(id, title, date, time)")
        .eq("user_id", user.id);
      setVolunteerHours(hoursData || []);
      setTotalHours((hoursData || []).reduce((sum, h) => sum + (h.hours || 0), 0));

      // Aggregate for graph
      if (hoursData) {
        setGraphData(aggregateHours(hoursData, "month"));
      }

      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  // Update graph when period or data changes
  useEffect(() => {
    setGraphData(aggregateHours(volunteerHours, graphPeriod));
  }, [volunteerHours, graphPeriod]);

  // Helper to aggregate hours
  function aggregateHours(hoursArr: any[], period: "week" | "month" | "year") {
    if (!hoursArr || hoursArr.length === 0) return [];
    const map: Record<string, number> = {};
    hoursArr.forEach((h) => {
      const date = h.event?.date;
      if (!date) return;
      const d = new Date(date);
      let key = "";
      if (period === "week") {
        // Week of year
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(
          (((d as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7,
        );
        key = `${d.getFullYear()}-W${week}`;
      } else if (period === "month") {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      } else {
        key = `${d.getFullYear()}`;
      }
      map[key] = (map[key] || 0) + (h.hours || 0);
    });
    // Sort keys
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, hours]) => ({ name, hours }));
  }

  const handleSignUp = async (eventId: string) => {
    setSignupLoading(eventId);
    await supabase.from("event_signups").insert({
      event_id: eventId,
      user_id: userData.id,
      status: "SIGNED_UP",
    });
    const { data: signups } = await supabase
      .from("event_signups")
      .select("*")
      .eq("user_id", userData.id);
    const signupMap: Record<string, any> = {};
    (signups || []).forEach((su) => {
      signupMap[su.event_id] = su;
    });
    setUserSignups(signupMap);
    setSignupLoading(null);
  };

  const handleCancelSignup = async (eventId: string) => {
    if (!window.confirm("Cancel your signup for this event?")) return;
    setSignupLoading(eventId);
    await supabase.from("event_signups").delete().eq("id", userSignups[eventId].id);
    const { data: signups } = await supabase
      .from("event_signups")
      .select("*")
      .eq("user_id", userData.id);
    const signupMap: Record<string, any> = {};
    (signups || []).forEach((su) => {
      signupMap[su.event_id] = su;
    });
    setUserSignups(signupMap);
    setSignupLoading(null);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((ev) => ev.date >= todayStr);
  const pastEvents = events.filter((ev) => ev.date < todayStr);

  if (loading)
    return <div className="py-32 text-center text-xl text-[#4d5640]">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#f8faf5] py-24 px-4 flex justify-center items-start relative">
      {/* Admin Panel and Log Out Buttons (fixed, stacked, always spaced) */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {userData.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
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
                onChange={(e) => setGraphPeriod(e.target.value as any)}
              >
                <option value="week">By Week</option>
                <option value="month">By Month</option>
                <option value="year">By Year</option>
              </select>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="name" stroke="#73814f" />
                  <YAxis stroke="#73814f" allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#70923e"
                    strokeWidth={4}
                    activeDot={{ r: 8 }}
                  />
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
              {upcomingEvents.map((event) => {
                const signedUp = !!userSignups[event.id];

                return (
                  <li
                    key={event.id}
                    className="bg-[#f5f9e6] p-6 rounded-xl shadow flex justify-between flex-col lg:flex-row items-start lg:items-center gap-4"
                  >
                    <div>
                      <p className="font-bold text-[#4a612c] text-xl">{event.title}</p>
                      <p className="text-sm text-[#6b7f46]">
                        {formatDate(event.date)} {event.time && `at ${event.time}`}
                      </p>
                      <p className="text-sm text-[#6b7f46]">{event.location}</p>
                      {event.waiver_required && event.waiver_url && event.date >= todayStr && (
                        <>
                          <p className="text-xs mt-1 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold w-fit">
                            Waiver Required
                          </p>
                          <p className="text-xs mt-1 text-red-700 font-semibold">
                            This event requires a signed waiver.{" "}
                            <a href={event.waiver_url} download className="underline text-blue-700">
                              Download Waiver PDF
                            </a>{" "}
                            and bring a signed copy in person.
                          </p>
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
                      >
                        View
                      </button>
                      {signedUp ? (
                        <button
                          onClick={() => handleCancelSignup(event.id)}
                          disabled={signupLoading === event.id}
                          className="bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-700"
                        >
                          {signupLoading === event.id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSignUp(event.id)}
                          disabled={signupLoading === event.id}
                          className="bg-[#70923e] text-white px-4 py-1.5 rounded-full font-semibold hover:bg-[#4f6e2d]"
                        >
                          {signupLoading === event.id ? "Signing Up..." : "Sign Up"}
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
              {pastEvents.map((ev) => (
                <li key={ev.id} className="text-sm font-medium">
                  {ev.title} — {formatDate(ev.date)} {ev.time ? `at ${ev.time}` : ""}
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
                        <td className="px-4 py-2">{vh.event?.title || "-"}</td>
                        <td className="px-4 py-2">
                          {vh.event?.date ? formatDate(vh.event.date) : "-"}
                        </td>
                        <td className="px-4 py-2">{vh.event?.time || "-"}</td>
                        <td className="px-4 py-2 font-bold">{vh.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#f5f9e6] font-bold">
                      <td className="px-4 py-2" colSpan={3}>
                        Total
                      </td>
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
        <EventModal
          selectedEvent={selectedEvent}
          setShowEventModal={setShowEventModal}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

const EventSignupCount = ({ eventId }: { eventId: string }) => {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("event_signups")
        .select("id", { count: "exact" })
        .eq("event_id", eventId);
      setCount(count ?? 0);
    };
    fetchCount();
  }, [eventId]);

  return (
    <p className="mt-4 font-semibold text-[#4d5640]">
      Signed up volunteeers: {count ?? "Loading..."}
    </p>
  );
};

const EventModal = ({ selectedEvent, setShowEventModal, formatDate }) => {
  const isUpcomingEvent = selectedEvent.date >= new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#b8c19a] animate-in fade-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-[#49682d] pr-8 leading-tight">
              {selectedEvent.title}
            </h3>
            <button
              onClick={() => setShowEventModal(false)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Image */}
          {selectedEvent.image && (
            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <img
                src={selectedEvent.imageUrl || ""}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          )}

          {/* Description */}
          {selectedEvent.description && (
            <div>
              <p className="text-[#4d5640] leading-relaxed">{selectedEvent.description}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid gap-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Calendar className="text-[#49682d] mt-0.5 flex-shrink-0" size={18} />
              <p className="font-medium text-gray-900">{formatDate(selectedEvent.date)}</p>
            </div>
            {selectedEvent.time && (
              <div className="flex items-start gap-3">
                <Clock className="text-[#49682d] mt-0.5 flex-shrink-0" size={18} />
                <p className="font-medium text-gray-900">{selectedEvent.time}</p>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="text-[#49682d] mt-0.5 flex-shrink-0" size={18} />
              <p className="text-gray-900">{selectedEvent.location}</p>
            </div>

            {/* Waiver Info */}
            <div className="flex items-start gap-3">
              <FileText className="text-[#49682d] mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="font-medium text-gray-900">
                  Waiver Required: {selectedEvent.waiver_required ? "Yes" : "No"}
                </p>

                {selectedEvent.waiver_required && selectedEvent.waiver_url && isUpcomingEvent && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 font-medium mb-2">⚠️ Waiver Required</p>
                    <p className="text-sm text-red-700 mb-2">
                      This event requires a signed waiver. Please download, sign, and bring a copy
                      with you.
                    </p>
                    <a
                      href={selectedEvent.waiver_url}
                      download
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                    >
                      <FileText size={14} />
                      Download Waiver PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Signup Count Component */}
          <div className="pt-4 border-t border-gray-100">
            <EventSignupCount eventId={selectedEvent.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
