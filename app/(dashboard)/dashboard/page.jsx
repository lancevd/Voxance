"use client";

import Feedback from "@/app/components/dashboard/Feedback";
import PreviousLectures from "@/app/components/dashboard/PreviousLectures";
import PromptModal from "@/app/components/dashboard/PromptModal";
import { useAuth } from "@/app/context/authContext";
import { ExpertsList } from "@/services/Options";
import Image from "next/image";
import { useState } from "react";

// app/(dashboard)/page.jsx
export default function DashboardPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const openModal = (item) => {
    setSelectedExpert(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
  };

  return (
    <main className="p-8 md:p-20 lg:p-48 xl:p-56">
      <h1 className="font-bold dark:text-gray-50 text-2xl md:text-3xl lg:text-4xl">
        Welcome Back, <br /> {user ? user.firstName : ""}
      </h1>
      <br />
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-center justify-space-between">
        {ExpertsList.map((item, index) => (
          <div
            key={index}
            onClick={() => openModal(item)}
            className="border dark:text-gray-50 dark:border-gray-50 flex flex-col gap-2 items-center p-2 cursor-pointer rounded-lg"
          >
            <Image
              src={item.icon}
              alt={item.name}
              width={150}
              height={150}
              className="hover:rotate-12 transition-all"
            />
            {item.name}
          </div>
        ))}
      </section>
      <PromptModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedExpert={selectedExpert}
      />
      <div className="h-8 md:h-12"></div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
        <PreviousLectures />
        <Feedback />
      </section>
    </main>
  );
}
