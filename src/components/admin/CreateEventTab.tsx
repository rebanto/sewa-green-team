const CreateEventTab = ({
  eventForm,
  handleEventChange,
  saveEvent,
  setEventForm
}: any) => (
  <section>
    <form onSubmit={saveEvent} className="space-y-4 max-w-xl mx-auto">
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

export default CreateEventTab;