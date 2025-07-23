const NotAllowed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/90 border border-[#cdd1bc] p-10 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#b87539] mb-4">🚫 Access Denied!</h1>
        <p className="text-[#4d5640] mb-6">
          Oops! You just tried to sneak into a page you’re not allowed to see.
          <br />
          <span className="text-[#8a9663] font-semibold">Nice try, secret agent.</span> 🕵️‍♂️
          <br />
          But this area is for authorized personnel only.
          <br />
          <br />
          Maybe try a different door? Or go back to the{" "}
          <a href="/" className="underline text-[#8a9663]">
            home page
          </a>{" "}
          and act casual.
        </p>
        <img
          src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
          alt="No entry"
          className="mx-auto rounded-lg shadow mb-2"
          style={{ maxWidth: "200px" }}
        />
      </div>
    </div>
  );
};

export default NotAllowed;
