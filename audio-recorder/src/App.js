import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
//import Navbar from "./components/Navigation/Navbar";
import AudioRecording from "./components/AudioRecorder/AudioRecording";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Audio Recorder
          </h1>
          <AudioRecording />
        </main>
      </div>
    </Router>
  );
}

export default App;
