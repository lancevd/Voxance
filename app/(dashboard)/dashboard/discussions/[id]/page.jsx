"use client";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/authContext";
import { AIModel, getToken } from "@/services/GlobalServices";
import { axiosInstance } from "@/utils/axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AssemblyAI } from "assemblyai";
import RecordRTC from "recordrtc";
import toast from "react-hot-toast";
import ChatBox from "@/components/dashboard/ChatBox";

const Page = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcribe, setTranscribe] = useState([]);
  const [conversation, setConversation] = useState([
    {
      role: "system",
      content: "What can I do for you",
    },
    {
      role: "user",
      content: "Help me.",
    },
  ]);
  const { user } = useAuth();
  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  const silenceTimeoutRef = useRef(null);
  // 🔥 ADDED: Rate limiting state
  const [rateLimitTimeout, setRateLimitTimeout] = useState(null);

  async function fetchDiscussion() {
    try {
      const response = await axiosInstance.get(`/discussion/${id}`);
      if (response.data) {
        setDiscussion(response.data.item);
        // console.log("Fetched discussion:", response.data.item);
      }
    } catch (error) {
      console.error("Error fetching discussion:", error);
    }
  }

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  async function connectToServer() {
    try {
      setIsConnecting(true);

      // Get API key from your backend
      const fetchedToken = await getToken();
      // console.log("The TOKEN is:", fetchedToken);

      const client = new AssemblyAI({
        // apiKey: fetchedToken,
      });

      // Create streaming transcriber with correct method
      realtimeTranscriber.current = client.streaming.transcriber({
        sampleRate: 16000,
        formatTurns: true,
        token: fetchedToken,
      });

      // Set up event listeners
      realtimeTranscriber.current.on("open", ({ sessionId }) => {
        setConnected(true);
      });

      realtimeTranscriber.current.on("error", (error) => {
        setConnected(false);
      });

      realtimeTranscriber.current.on("close", (code, reason) => {
        console.log("Session closed:", code, reason);
        setConnected(false);
      });

      realtimeTranscriber.current.on("turn", async (turn) => {
        if (!turn || !turn.transcript) return;

        if (turn.turn_is_formatted === true) {
          const finalText = turn.transcript;

          // 🔥 CHANGED: Fix the transcribe state update and conversation flow
          const userMessage = {
            role: "user",
            content: finalText,
          };

          // Add user message to conversation immediately
          setConversation((prev) => [...prev, userMessage]);

          // 🔥 ADDED: Rate limiting check
          if (rateLimitTimeout) {
            console.log("Rate limited, skipping AI request");
            const rateLimitMessage = {
              role: "assistant",
              content:
                "Please wait a moment before sending another message due to rate limiting.",
            };
            setConversation((prev) => [...prev, rateLimitMessage]);
            return;
          }

          try {
            // Calling AI Model
            const aiResp = await AIModel(
              discussion.topic,
              discussion.coachingOption,
              finalText
            );
            console.log("AI Response:", aiResp);
            setConversation((prev) => [...prev, aiResp]);
          } catch (error) {
            console.error("AI Model Error:", error);

            // 🔥 ADDED: Handle rate limit errors
            if (error.message && error.message.includes("429")) {
              const errorMessage = {
                role: "assistant",
                content:
                  "I'm currently rate limited. Please wait a moment before continuing.",
              };
              setConversation((prev) => [...prev, errorMessage]);

              // Set rate limit timeout for 60 seconds
              setRateLimitTimeout(true);
              setTimeout(() => {
                setRateLimitTimeout(null);
              }, 60000);
            } else {
              const errorMessage = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
              };
              setConversation((prev) => [...prev, errorMessage]);
            }
          }
        }
      });
      // Connect to the streaming service
      await realtimeTranscriber.current.connect();
      console.log("Connected to AssemblyAI streaming service");

      // Start audio recording after successful connection
      await startAudioRecording();
    } catch (error) {
      console.error("Error in connectToServer:", error);
      setConnected(false);
    }
  }

  async function startAudioRecording() {
    if (typeof window === "undefined") return;

    try {
      // console.log("Starting audio recording...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      recorder.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 64000,
        ondataavailable: async (blob) => {
          if (!realtimeTranscriber.current) return;

          // console.log("Audio blob available:", blob);

          // Clear existing silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }

          try {
            const buffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);

            // Send audio data to the transcriber stream
            const writer = realtimeTranscriber.current.stream().getWriter();
            await writer.write(uint8Array);
            writer.releaseLock();

            // Set new silence timeout
            silenceTimeoutRef.current = setTimeout(() => {
              console.log("Silence detected, stopping recording.");
            }, 2000);
          } catch (error) {
            console.error("Error sending audio:", error);
          }
        },
      });

      recorder.current.startRecording();
      setIsConnecting(false);
      console.log("Recording started successfully!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Mic error! Enable microphone and try again.");
    }
  }

  async function disconnect() {
    try {
      setConnected(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      // Stop recorder
      if (recorder.current) {
        recorder.current.stopRecording();
        recorder.current = null;
      }
      // Close transcriber
      if (realtimeTranscriber.current) {
        await realtimeTranscriber.current.close();
        realtimeTranscriber.current = null;
      }

      console.log("Disconnected successfully");
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  }

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <main className="p-8 md:w-4/5 mx-auto dark:text-gray-50">
      <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">
        Welcome to the discussion room!
      </h2>
      <br />
      {!discussion ? (
        <Spinner />
      ) : (
        <section className="grid grid-cols-1 h-[70vh] gap-6 md:grid-cols-[50%_50%] lg:grid-cols-[60%_40%]">
          <div className="w-full">
            <div className="rounded-lg h-full md:rounded-3xl flex flex-col justify-between bg-gray-800 p-2 md:p-4">
              <h3>{discussion ? discussion.topic : "Topic"}</h3>
              <div className="flex flex-col gap-4 items-center">
                <Image
                  src={`/images/${discussion.expertName}.png` || "Expert"}
                  alt="Expert"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <p className="text-lg text-gray-100">{discussion.expertName}</p>
              </div>
              <div className="flex flex-col gap-4 items-center bg-gray-850 rounded-lg">
                <p className="text-lg text-gray-100">{user?.firstName}</p>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-center">
              {connected ? (
                <button
                  onClick={disconnect}
                  className="w-fit px-6 rounded py-3 bg-red-700 hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectToServer}
                  disabled={isConnecting}
                  className="w-fit px-6 rounded py-3 bg-blue-700 hover:bg-blue-600 transition-colors"
                >
                  {isConnecting ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>
          <div className="w-full">
            <ChatBox conversation={conversation} />
            <p className="text-sm text-center mt-4 text-gray-100">
              We will generate a feedback at the end of your conversation.
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
