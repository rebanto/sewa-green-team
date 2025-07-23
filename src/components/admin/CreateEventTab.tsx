import { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

const CreateEventTab = ({ eventForm, handleEventChange, saveEvent, setEventForm }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Fetch current image URL when editing an event
  useEffect(() => {
    const fetchCurrentImage = async () => {
      if (eventForm.image_id) {
        try {
          // Get the file info from storage
          const { data: files, error } = await supabase.storage
            .from("events")
            .list("images", { limit: 1000 });

          if (error) throw error;

          // Find the file with matching ID
          const imageFile = files?.find((file) => file.id === eventForm.image_id);

          if (imageFile) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("events").getPublicUrl(`images/${imageFile.name}`);
            setCurrentImageUrl(publicUrl);
          } else {
            setCurrentImageUrl(null);
          }
        } catch (error) {
          console.error("Error fetching current image:", error);
          setCurrentImageUrl(null);
        }
      } else {
        setCurrentImageUrl(null);
      }
    };

    fetchCurrentImage();
  }, [eventForm.image_id]);

  return (
    <section>
      <form
        onSubmit={(e) =>
          saveEvent(e, fileInputRef.current?.files?.[0], imageInputRef.current?.files?.[0])
        }
        className="space-y-4 max-w-xl mx-auto"
      >
        <input
          name="title"
          value={eventForm.title}
          onChange={handleEventChange}
          placeholder="Event Title"
          required
          className="formInput"
        />
        <textarea
          name="description"
          value={eventForm.description}
          onChange={handleEventChange}
          placeholder="Event Description"
          required
          className="formInput"
        />
        <input
          type="date"
          name="date"
          value={eventForm.date}
          onChange={handleEventChange}
          required
          className="formInput"
        />
        <input
          type="time"
          name="time"
          value={eventForm.time}
          onChange={handleEventChange}
          required
          className="formInput"
        />
        <input
          name="location"
          value={eventForm.location}
          onChange={handleEventChange}
          placeholder="Location"
          required
          className="formInput"
        />
        <div>
          <label className="block mb-1 font-semibold">Event Image (Optional)</label>
          <input type="file" accept="image/*" ref={imageInputRef} className="formInput" />
          {currentImageUrl && (
            <div className="mt-2">
              <p className="text-xs mb-1">Current image:</p>
              <img
                src={currentImageUrl}
                alt="Event preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="waiver_required"
            checked={eventForm.waiver_required}
            onChange={handleEventChange}
          />
          Waiver Required?
        </label>
        {eventForm.waiver_required && (
          <div>
            <label className="block mb-1 font-semibold">
              Upload Waiver PDF <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="formInput"
              required={!eventForm.waiver_url}
            />
            {eventForm.waiver_url && eventForm.date >= new Date().toISOString().split("T")[0] && (
              <p className="text-xs mt-1">
                Current:{" "}
                <a
                  href={eventForm.waiver_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700"
                >
                  Download Existing Waiver
                </a>
              </p>
            )}
          </div>
        )}
        <button
          type="submit"
          className="bg-[#8a9663] text-white font-semibold px-6 py-2 rounded-full"
        >
          {eventForm.id ? "Update Event" : "Create Event"}
        </button>
        {eventForm.id && (
          <button
            type="button"
            onClick={() =>
              setEventForm({
                id: "",
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                waiver_required: false,
                waiver_url: "",
                image_id: "",
              })
            }
            className="ml-4 bg-gray-300 hover:bg-gray-400 rounded-full px-6 py-2"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </section>
  );
};

export default CreateEventTab;
