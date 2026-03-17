"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import Peer from "peerjs";

export default function Classroom() {
  const params = useParams();
  const roomId = params.id as string;
  
  const [peers, setPeers] = useState<string[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const videoGridRef = useRef<HTMLDivElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  
  const myStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;
    
    // Initialize PeerJS
    const peer = new Peer();
    peerRef.current = peer;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      myStreamRef.current = stream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      peer.on("open", (id) => {
        socket.emit("join-room", roomId, id);
      });

      // When another user calls us
      peer.on("call", call => {
        call.answer(myStreamRef.current!); 
        const video = document.createElement("video");
        
        call.on("stream", userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      // When a new user connects via socket
      socket.on("user-connected", (userId) => {
        setPeers(prev => [...prev, userId]);
        connectToNewUser(userId, myStreamRef.current!);
      });
    }).catch(err => {
      console.error("Failed to get local stream", err);
    });

    socket.on("user-disconnected", userId => {
      setPeers(prev => prev.filter(id => id !== userId));
      // In a real app, clean up the specific video element for that user here
    });

    function connectToNewUser(userId: string, stream: MediaStream) {
      const call = peer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
    }

    function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      video.style.width = "100%";
      video.style.borderRadius = "var(--border-radius)";
      if (videoGridRef.current) {
        // Simple check to prevent duplicate videos from the same stream
        videoGridRef.current.append(video);
      }
    }

    return () => {
      socket.disconnect();
      peer.destroy();
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  const toggleScreenShare = async () => {
    if (!peerRef.current || !myStreamRef.current) return;

    if (isScreenSharing) {
      // Revert to camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = stream.getVideoTracks()[0];
        
        if (myVideoRef.current) {
           myVideoRef.current.srcObject = stream;
        }
        myStreamRef.current = stream;

        // Replace track on all outgoing connections
        const connections = peerRef.current.connections as Record<string, any[]>;
        for (let peerId in connections) {
          connections[peerId].forEach((conn: any) => {
            if (conn.peerConnection) {
              const sender = conn.peerConnection.getSenders().find((s: any) => s.track && s.track.kind === 'video');
              if (sender) sender.replaceTrack(videoTrack);
            }
          });
        }
        setIsScreenSharing(false);
      } catch (err) {
        console.error("Failed to switch back to camera", err);
      }
    } else {
      // Switch to screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenVideoTrack = screenStream.getVideoTracks()[0];

        // Listen for user stopping screen share via browser native UI
        screenVideoTrack.onended = () => {
          toggleScreenShare(); // Toggle back to camera
        };

        // Create a mixed stream: Screen Video + Microphone Audio (if available)
        const audioTracks = myStreamRef.current.getAudioTracks();
        const mixedStream = new MediaStream([screenVideoTrack, ...audioTracks]);
        
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mixedStream;
        }

        // Replace track on all outgoing connections
        const connections = peerRef.current.connections as Record<string, any[]>;
        for (let peerId in connections) {
          connections[peerId].forEach((conn: any) => {
            if (conn.peerConnection) {
              const sender = conn.peerConnection.getSenders().find((s: any) => s.track && s.track.kind === 'video');
              if (sender) sender.replaceTrack(screenVideoTrack);
            }
          });
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Failed to start screen sharing", err);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "2rem" }}>Classroom: {roomId}</h2>
      
      <div 
        ref={videoGridRef} 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem"
        }}
      >
        <div>
          <video 
            ref={myVideoRef} 
            muted 
            autoPlay 
            playsInline
            style={{ width: "100%", borderRadius: "var(--border-radius)", border: "2px solid var(--primary-color)" }}
          />
          <p style={{ textAlign: "center", marginTop: "0.5rem" }}>You {isScreenSharing ? "(Presenting)" : ""}</p>
        </div>
        {/* Remote videos will be dynamically injected into the grid here */}
      </div>

      <div style={{ marginTop: "4rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button className="btn btn-secondary">Toggle Mute</button>
        <button className="btn btn-secondary">Toggle Video</button>
        <button 
          className="btn btn-primary" 
          onClick={toggleScreenShare}
          style={{ backgroundColor: isScreenSharing ? "var(--warning-color, #d39e00)" : "var(--primary-color)" }}
        >
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </button>
        <button className="btn btn-primary" style={{ backgroundColor: "var(--danger-color)", borderColor: "var(--danger-color)" }}>Leave Class</button>
      </div>
    </div>
  );
}
