import React from 'react'

const ChatBox = ({conversation}) => {
  return (
    <div className="rounded-lg h-full md:rounded-3xl bg-gray-800 p-2 md:p-4 flex flex-col">
      <h4 className="mb-4">Live Chat</h4>
      <div className="overflow-y-scroll p-3 flex flex-col gap-2 rounded text-gray-100 text-sm max-h-128">
        {conversation.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet.</p>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg?.role === 'user' ? 'bg-gray-900 self-end' : 'bg-gray-600 self-start'
              } max-w-[80%]`}
            >
              <p>{msg?.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatBox