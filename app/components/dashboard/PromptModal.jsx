"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const PromptModal = ({ isOpen, onClose, selectedExpert }) => {
  if (!isOpen) return null;

  return (
    <div
      id="defaultModal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center backdrop-brightness-20 items-center overflow-y-auto overflow-x-hidden"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        {/* Modal content */}
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          {/* Modal header */}
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedExpert
                ? `Create prompt for ${selectedExpert.name}`
                : "Create Prompt"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex border items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <FaX />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form method="POST">
            {/* Prompt text area */}
            <div className="mb-4">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                <br />
                Prompt
              </label>
              <textarea
                id="prompt"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write your prompt here..."
              ></textarea>
            </div>
            {/* Tutor selection */}
            <div className="mb-4">
              <h4 className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Choose Your Tutor
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-2xl dark:text- p-2 cursor-pointer bg-gray-100 dark:bg-gray-700">
                  <img
                    src="/images/tutor-1-min.png"
                    alt="Tutor 1"
                    className="w-full  h-auto object-cover hover:translate-x-4"
                  />
                  <p className="text-center text-sm">Tutor 1</p>
                </div>
                <div className="border rounded-2xl dark:text- p-2 cursor-pointer bg-gray-100 dark:bg-gray-700">
                  <img
                    src="/images/tutor-2-min.png"
                    alt="Tutor 2"
                    className="w-full  h-auto object-cover hover:translate-x-4"
                  />
                  <p className="text-center text-sm">Tutor 2</p>
                </div>
                <div className="border rounded-2xl dark:text- p-2 cursor-pointer bg-gray-100 dark:bg-gray-700">
                  <img
                    src="/images/tutor-3-min.png"
                    alt="Tutor"
                    className="w-full  h-auto object-cover hover:translate-x-4"
                  />
                  <p className="text-center text-sm">Tutor 3</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <FaPlus /> &nbsp; Submit Prompt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
