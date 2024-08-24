import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen text-black">
      <main className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-extrabold  mb-6">Bringing Creative Interiors to Life</h1>
          <p className="text-xl mb-6">
            Artville covers everything from seasonal décor to the latest design trends.
          </p>
          <div className="flex justify-center items-center space-x-6">
            <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
              Watch Video
            </button>
            <a href="#" className=" text-lg underline hover:text-teal-200">Explore More</a>
            <a href="#" className=" text-lg underline hover:text-teal-200">Trending</a>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative w-full max-w-5xl flex flex-col items-center sm:flex-row text-center bg-gradient-to-r from-green-400 to-blue-600 p-10 rounded-lg shadow-2xl">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmce0dRD3haQobowjl87TabSS35R_H9tdOpY1WWmNSqOvCH4bphGltTg&s"
            alt="Decor"
            className="w-full sm:w-1/2 rounded-lg mb-6 sm:mb-0 transform transition duration-500 hover:scale-105"
          />
          <div className="w-full sm:w-1/2 sm:pl-10">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Anonymous Messaging</h2>
            <p className="text-lg text-gray-600 mb-4">Send messages without revealing your identity.</p>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Secure and Private</h2>
            <p className="text-lg text-gray-600 mb-4">All messages are encrypted for your safety.</p>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Real-time Notifications</h2>
            <p className="text-lg text-gray-600">Get notified as soon as you receive a message.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
