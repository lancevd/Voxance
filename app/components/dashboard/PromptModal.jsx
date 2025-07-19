import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useToast from "../useToast";

const tutors = [
  { name: "Kenny", img: "/images/tutor-1-min.png" },
  { name: "Abigail", img: "/images/tutor-2-min.png" },
  { name: "Dame", img: "/images/tutor-3-min.png" },
];

export default function PromptModal({ isOpen, onClose, selectedExpert }) {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [canNext, setCanNext] = useState(false);
  const modalRef = useRef(null);
  const {showToast} = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedTutor(null);
      setPrompt("");
    }
  }, [isOpen, selectedExpert]);

  useEffect(() => {
    if (selectedTutor !== null && prompt.trim().length > 4) {
      setCanNext(true);
    } else {
      setCanNext(false);
    }
  }, [selectedTutor, prompt]);

  // Next step
  function handleNext() {
    if (!canNext) {
      showToast(
        "Ensure you select a tutor and enter at least 5 characters in the prompt", {type: "info"}
      );
    } else {
      showToast("Next step triggered!", {type: "success"});
    }
  }

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fadeInUp"
        style={{ animation: "fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1)" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
          Create prompt for {selectedExpert?.name || "Session"}
        </h2>
        <hr className="border-gray-700 mb-4" />
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Prompt</label>
          <textarea
            className="w-full min-h-[100px] rounded-lg bg-gray-700 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Write your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Choose Your Tutor
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tutors.map((tutor, idx) => (
              <label
                key={tutor.name}
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-gray-700/80 hover:border-primary-500 ${
                  selectedTutor === idx
                    ? "border-white shadow-lg scale-105"
                    : "border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="tutor"
                  className="hidden"
                  checked={selectedTutor === idx}
                  onChange={() => setSelectedTutor(idx)}
                />
                <Image
                  src={tutor.img}
                  alt={tutor.name}
                  width={90}
                  height={90}
                  className="rounded-full w-full object-cover mb-2 border-2 border-gray-500"
                />
                <span className="text-gray-100 font-medium">{tutor.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-white font-semibold text-lg transition-all duration-200 shadow-md"
            onClick={() => {
              /* handle submit here */
            }}
          >
            Cancel
          </button>
          <button
            className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-700/80 hover:bg-gray-700 text-white font-semibold text-lg transition-all duration-200 shadow-md"
            onClick={ handleNext}
            // disabled={!canNext}
            type="submit"
          >
            Next
          </button>
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
