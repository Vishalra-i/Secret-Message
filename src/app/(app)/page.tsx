import Image from "next/image";
import Feature from "@/components/Feature.tsx";
import Link from "next/link";

export default function Home() {
  return (
  <>
    <main className=" min-h-screen font-dm-sans text-black  bg-[url('/images/bg.avif')]  bg-cover bg-center relative hero-section p-0 flex flex-col"  >
    <section className="mt-36 px-4 sm:px-6 lg:px-8 z-50">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center">
          Share Your Thoughts
        </h3>
        <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center highlight font-mono mt-2">
          Anonymously
        </h3>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold max-w-[600px] mt-6 text-center">
          Express yourself freely without revealing your identity. Our platform
          ensures your privacy while connecting you with others.
        </p>
        <Link href='/sign-up'>
        <button className="my-8 text-base sm:text-lg md:text-xl font-bold px-8 py-3 sm:px-10 sm:py-4 cursor-pointer rounded-full bg-gradient-to-l from-[#00c6ff] to-[#3275fa] transition-all duration-300 ease shadow-md hover:translate-y-[-2px] hover:shadow-indigo-500/40">
          Start Messaging Now
        </button>
        </Link>
        <span className="text-base sm:text-lg text-gray-500 mt-2 text-center">
          Trusted by over 1 million users worldwide
        </span>
        <div
          id="box"
          className="w-full max-w-[300px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] my-12 sm:my-16 lg:my-24 border-yellow-400 border-2"
        >
          <Image
            src={"/images/bg.avif"}
            width={400}
            height={400}
            alt="All secret message"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
    </main>
      <Feature/>
    </>
  );
}
