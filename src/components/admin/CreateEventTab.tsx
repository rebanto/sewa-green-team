import { useRef } from 'react';

const CreateEventTab = ({
  eventForm,
  handleEventChange,
  saveEvent,
  setEventForm
}: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <section>
      <form onSubmit={e => saveEvent(e, fileInputRef.current?.files?.[0])} className="space-y-4 max-w-xl mx-auto">
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
            <label className="block mb-1 font-semibold">Upload Waiver PDF <span className="text-red-600">*</span></label>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="formInput"
              required={!eventForm.waiver_url}
            />
            {eventForm.waiver_url && (
              <p className="text-xs mt-1">Current: <a href={eventForm.waiver_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">Download Existing Waiver</a></p>
            )}
          </div>
        )}
        <button
          type="submit"
          className="bg-[#8a9663] text-white font-semibold px-6 py-2 rounded-full"
        >
          {eventForm.id ? 'Update Event' : 'Create Event'}
        </button>
        {eventForm.id && (
          <button
            type="button"
            onClick={() =>
              setEventForm({
                id: '',
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                waiver_required: false,
                waiver_url: '',
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