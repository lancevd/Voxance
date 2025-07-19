import { FaMicrophone, FaChalkboardTeacher, FaBriefcase, FaRobot } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center py-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold dark:text-white mb-4">
          Meet <span className="text-primary-600 dark:text-primary-400">Voxance</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
          Your AI Tutor & Coach. Learn, grow, and prepare for your future—<span className="text-primary-600 dark:text-primary-400">by voice</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="/auth" className="px-8 py-3 rounded-lg bg-primary-700 text-white font-semibold hover:bg-primary-800 transition shadow-lg">
            Get Started
          </a>
          <a href="#features" className="px-8 py-3 rounded-lg border border-primary-700 text-primary-700 dark:text-primary-400 dark:border-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-gray-800 transition">
            Learn More
          </a>
        </div>
        <div className="flex justify-center">
          <Image src="/voice-agent-illustration.svg" alt="Voxance Voice Agent" width={320} height={220} className="rounded-xl shadow-xl dark:bg-gray-800" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow">
          <FaMicrophone className="text-4xl text-primary-600 dark:text-primary-400 mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">Voice-First Experience</h2>
          <p className="text-gray-600 dark:text-gray-300">Talk to Voxance, your AI-powered tutor and coach. Just speak, and Voxance listens, understands, and responds in real time.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow">
          <FaChalkboardTeacher className="text-4xl text-primary-600 dark:text-primary-400 mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">Multi-Niche Learning</h2>
          <p className="text-gray-600 dark:text-gray-300">Explore a wide range of topics and skills. From academics to personal growth, Voxance adapts to your learning needs.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow">
          <FaBriefcase className="text-4xl text-primary-600 dark:text-primary-400 mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">Career & Interview Coaching</h2>
          <p className="text-gray-600 dark:text-gray-300">Get personalized career advice, resume tips, and AI-powered interview preparation to help you land your dream job.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow">
          <FaRobot className="text-4xl text-primary-600 dark:text-primary-400 mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">AI-Powered Personalization</h2>
          <p className="text-gray-600 dark:text-gray-300">Voxance learns from your interactions to deliver tailored lessons, feedback, and coaching—just for you.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-3xl text-center py-12">
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white mb-4">Ready to start your journey?</h2>
        <a href="/auth" className="inline-block px-10 py-4 rounded-lg bg-primary-700 text-white font-semibold hover:bg-primary-800 transition shadow-lg text-lg">
          Try Voxance Now
        </a>
      </section>
    </main>
  );
}
