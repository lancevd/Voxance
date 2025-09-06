"use client";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/authContext";
import { getToken } from "@/services/GlobalServices";
import { axiosInstance } from "@/utils/axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { RealtimeTranscriber } from "assemblyai";
// import RecordRTC from "recordrtc";

const Page = () => {
  const { id } = useParams(); // Destructure the id from the params object
  const [discussion, setDiscussion] = useState(null);
  const [connected, setConnected] = useState(false);
  const [transcribe, setTranscribe] = useState();
  const { user } = useAuth();
  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  let silenceTimeout;
  let texts = {};

  async function fetchDiscussion() {
    try {
      const response = await axiosInstance.get(`/discussion/${id}`);
      if (response.data) {
        setDiscussion(response.data.item);
        console.log("Fetched discussion:", discussion);
      }
    } catch (error) {
      console.error("Error fetching discussion:", error);
    }
  }
  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  async function connectToServer() {
    // Initialize Assembly AI
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sample_rate: 16_000,
    })

    realtimeTranscriber.current.on("transcript", async (transcript) => {
      console.log(transcript)
      texts[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(texts);
      keys.sort((a,b) => a-b);
      for ( const key of keys){
        if (texts[key]) {
          msgs +=`${texts[key]}`
        }
      }
      setTranscribe(msg);
    })
    await realtimeTranscriber.current.connect();

    if (typeof window === "undefined") return;
    try {
      const { default: RecordRTC, StereoAudioRecorder } = await import(
        "recordrtc"
      );

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        timeSlice: 250,
        audioBitsPerSecond: 64000,
        ondataavailable: async (blob) => {
          if (!realtimeTranscriber.current) return;
          console.log("Audio blob available:", blob);
          clearTimeout(silenceTimeout);
          const buffer = await blob.arrayBuffer();
          realtimeTranscriber.current.sendAudio(buffer);
          silenceTimeout = setTimeout(() => {
            console.log("Silence detected, stopping recording.");
          }, 2000);
          setConnected(true);
        },
      });

      recorder.current.startRecording();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  async function disconnect() {
    setConnected(false);
    await realtimeTranscriber.current.close();
    recorder.current.pauseRecording();
    recorder.current = null;
  }

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
                {/* <div className="rounded-full"> */}
                <Image
                  src={`/images/${discussion.expertName}.png` || "Expert"}
                  alt="Expert"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                {/* </div> */}
                <p className="text-lg text-gray-100">{discussion.expertName}</p>
              </div>
              <div className="flex flex-col gap-4 items-center bg-gray-850 rouned-lg">
                {/* <Image
                src={user.profilePicture || "User"}
                alt="Expert"
                width={150}
                height={150}
                className="rounded-full border-2 border-gray-200"
              /> */}
                <p className="text-lg text-gray-100">{user?.firstName}</p>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-center">
              {connected ? (
                <button
                  onClick={disconnect}
                  className="w-fit px-6 rounded py-3 bg-red-700 "
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectToServer}
                  className="w-fit px-6 rounded py-3 bg-blue-700 "
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="rounded-lg h-full md:rounded-3xl bg-gray-800 p-2 md:p-4">
              Chat
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
