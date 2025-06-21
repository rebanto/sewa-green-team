const NotApproved = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/90 border border-[#cdd1bc] p-10 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#8a9663] mb-4">Your account is pending approval</h1>
        <p className="text-[#4d5640] mb-6">
          Your registration was successful, but your account hasn’t been approved yet.
          Please wait for a team lead to review and approve your registration and check back later.
        </p>
        <a href="/" className="inline-block px-6 py-2 bg-[#8a9663] text-white rounded-full font-semibold hover:bg-[#73814f] transition">Go to Home</a>
      </div>
    </div>
  );
};

export default NotApproved;
