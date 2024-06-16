import Image from "next/image";


export default function Home() {
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-blue-500">
      
      <main className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Bringing Creative Interiors into life</h1>
          <p className="text-lg text-white mb-4">
            When it comes to home decorating blogs, Artville covers everything from seasonal décor to the latest and greatest design trends.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full">Watch Video</button>
            <a href="#" className="text-white">Explore More</a>
            <a href="#" className="text-white">Trending</a>
          </div>
        </section>
        <section className="relative w-full max-w-4xl flex flex-col items-center sm:flex-row text-center bg-white p-8 rounded-lg shadow-lg">
          <img src="/path-to-your-image.png" alt="Decor" className="w-full sm:w-1/2 rounded-lg mb-4 sm:mb-0" />
          <div className="w-full sm:w-1/2 sm:pl-8">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Anonymous Messaging</h2>
            <p className="text-gray-600">Send messages without revealing your identity.</p>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Secure and Private</h2>
            <p className="text-gray-600">All messages are encrypted for your safety.</p>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Real-time Notifications</h2>
            <p className="text-gray-600">Get notified as soon as you receive a message.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
