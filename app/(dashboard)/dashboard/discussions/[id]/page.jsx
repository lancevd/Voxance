"use client";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/authContext";
import { getToken } from "@/services/GlobalServices";
import { axiosInstance } from "@/utils/axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AssemblyAI } from "assemblyai";
import RecordRTC from "recordrtc";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcribe, setTranscribe] = useState("");
  const { user } = useAuth();
  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  const silenceTimeoutRef = useRef(null);
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
      console.log("The TOKEN is:", fetchedToken);

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
        setIsConnecting(false);
        setConnected(true);
      });

      realtimeTranscriber.current.on("error", (error) => {
        setConnected(false);
      });

      realtimeTranscriber.current.on("close", (code, reason) => {
        console.log("Session closed:", code, reason);
        setConnected(false);
      });

      realtimeTranscriber.current.on("turn", (turn) => {
        if (!turn || !turn.transcript) return;

        if (turn.turn_is_formatted === true) {
          const finalText = turn.transcript;
          setTranscribe((prev) => [
            ...prev,
            {
              role: "user",
              content: finalText,
            },
          ]);
          console.log("Final (formatted) turn received:", finalText);
        } else {
          // ignore partial / unformatted final here (they arrive earlier)
          console.log("Ignored turn (not formatted yet):", turn);
        }
      });

      console.log("Transcriber created:", realtimeTranscriber.current);

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
      console.log("Starting audio recording...");

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
            <div className="rounded-lg h-full md:rounded-3xl bg-gray-800 p-2 md:p-4 flex flex-col">
              <h4 className="mb-4">Live Chat</h4>
              <div className="overflow-y-scroll bg-gray-900 p-3 rounded text-gray-200 text-sm h-64">
                {transcribe.length > 0 ? (
                  transcribe.map((item, index) => (
                    <p key={index} className="">
                      {item.content}
                    </p>
                  ))
                ) : (
                  <p className="">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Voluptate asperiores placeat saepe dolore rerum deleniti eum
                    id nobis aliquid officia totam fugit atque laborum eius sed
                    sunt sequi soluta ratione quis laudantium fugiat iure, odit
                    unde? Libero minima molestiae perferendis obcaecati, earum
                    alias at aliquid voluptas maiores unde accusamus dolorum
                    repellat ipsum. Dignissimos velit vero asperiores
                    consectetur amet libero enim nisi molestiae? Quidem pariatur
                    nesciunt totam ipsam magni eligendi, quibusdam similique,
                    repellendus modi nobis quasi perferendis cum expedita
                    tempora recusandae, sapiente inventore consectetur excepturi
                    eos numquam molestias? Repellendus, eaque quam magnam
                    pariatur earum molestias officia deleniti repellat.
                    Nesciunt, doloremque quidem? <br /> Lorem ipsum dolor sit
                    amet consectetur, adipisicing elit. Voluptate asperiores
                    placeat saepe dolore rerum deleniti eum id nobis aliquid
                    officia totam fugit atque laborum eius sed sunt sequi soluta
                    ratione quis laudantium fugiat iure, odit unde? Libero
                    minima molestiae perferendis obcaecati, earum alias at
                    aliquid voluptas maiores unde accusamus dolorum repellat
                    ipsum. Dignissimos velit vero asperiores consectetur amet
                    libero enim nisi molestiae? Quidem pariatur nesciunt totam
                    ipsam magni eligendi, quibusdam similique, repellendus modi
                    nobis quasi perferendis cum expedita tempora recusandae,
                    sapiente inventore consectetur excepturi eos numquam
                    molestias? Repellendus, eaque quam magnam pariatur earum
                    molestias officia deleniti repellat. Nesciunt, doloremque
                    quidem?{" "}
                  </p>
                )}
              </div>
            </div>
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
