import React from "react";

const page = () => {
  
  return (
    <main className="p-8 md:w-4/5 mx-auto dark:text-gray-50">
      <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">Welcome to the discussion room!</h2>
      <br />
      <section className="grid grid-cols-1 md:grid-cols-[50%_50%] lg:grid-cols-[60%_40%]">
        <div className="">
          <h3>Chat with teacher</h3>
        </div>
        <div className="">Chat</div>
      </section>
    </main>
  );
};

export default page;
