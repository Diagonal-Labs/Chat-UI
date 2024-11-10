import React, { Component } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import MicRecorder from "mic-recorder-to-mp3";
import SubmitButton from "./SubmitButton";
import axios from "axios";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

// Static questions array
const QUESTIONS = [
  {
    id: 1,
    text: "Tell me about your favorite programming language and why you like it?",
  },
  {
    id: 2,
    text: "What was the most challenging project you've worked on?",
  },
  {
    id: 3,
    text: "How do you handle stress during tight deadlines?",
  },
  {
    id: 4,
    text: "Describe your approach to learning new technologies.",
  },
  {
    id: 5,
    text: "What are your career goals for the next five years?",
  },
];

class AudioRecording extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      isBlocked: false,
      currentQuestionIndex: 0,
      recordings: [],
      isSubmitting: false,
      questions: QUESTIONS,
      currentRecording: null,
    };
  }

  componentDidMount() {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        this.setState({ isBlocked: false });
      },
      () => {
        console.log("Permission Denied");
        this.setState({ isBlocked: true });
      }
    );
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        this.setState({
          currentRecording: { blobURL, blob },
          isRecording: false,
        });
      })
      .catch((e) => console.log(e));
  };

  handleSubmit = async () => {
    const { currentQuestionIndex, currentRecording, questions } = this.state;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    this.setState({ isSubmitting: true });
    try {
      // Simulated API call for recording submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.setState(
        (prevState) => ({
          recordings: [
            ...prevState.recordings,
            {
              questionId: prevState.questions[currentQuestionIndex].id,
              blobURL: currentRecording.blobURL,
              blob: currentRecording.blob,
            },
          ],
          currentRecording: null,
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          isSubmitting: false,
        }),
        async () => {
          // Send email only if this was the last question (5th submission)
          if (isLastQuestion) {
            await this.sendCompletionEmail();
          }
        }
      );
    } catch (error) {
      console.error("Error submitting recording:", error);
      this.setState({ isSubmitting: false });
    }
  };

  sendCompletionEmail = async () => {
    try {
      await axios.post(
        "https://us-central1-cloud-run-with-python-438916.cloudfunctions.net/email-function",
        {
          email: "venkatramang23092003@gmail.com", // Get from auth context
          completedAt: new Date().toISOString(),
          recordings: this.state.recordings, // Optional: send recordings data if needed
        }
      );
      this.setState({ emailSent: true });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  render() {
    const {
      isRecording,
      currentQuestionIndex,
      questions,
      currentRecording,
      isSubmitting,
    } = this.state;

    const isComplete = currentQuestionIndex >= questions.length;
    const currentQuestion = questions[currentQuestionIndex];

    if (isComplete) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600">
              You have successfully completed all questions.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {/* Progress Indicator */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Interview Questions
              </h2>
              <div className="flex items-center justify-center space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentQuestionIndex
                        ? "bg-green-500"
                        : index === currentQuestionIndex
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-600 mt-4">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            {/* Current Question */}
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-lg sm:text-xl text-blue-900 font-medium">
                {currentQuestion.text}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {!currentRecording && (
                <div className="relative">
                  {isRecording ? (
                    <button
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-red-600 border-6 sm:border-8 border-red-400 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                      onClick={this.stop}
                    >
                      <FaStop className="w-12 h-12 sm:w-16 sm:h-16" />
                    </button>
                  ) : (
                    <button
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-gray-800 border-6 sm:border-8 border-gray-400 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                      onClick={this.start}
                    >
                      <FaMicrophone className="w-12 h-12 sm:w-16 sm:h-16" />
                    </button>
                  )}
                </div>
              )}

              {/* Recording Status */}
              {isRecording && (
                <p className="text-red-500 text-base sm:text-lg font-medium animate-pulse">
                  Recording in progress...
                </p>
              )}
            </div>

            {/* Current Recording */}
            {currentRecording && (
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full max-w-md">
                    <audio
                      src={currentRecording.blobURL}
                      controls
                      className="w-full"
                    />
                  </div>
                  <SubmitButton
                    onClick={this.handleSubmit}
                    isSubmitting={isSubmitting}
                    text={`Submit & ${
                      currentQuestionIndex === questions.length - 1
                        ? "Finish"
                        : "Next"
                    }`}
                    loadingText="Submitting..."
                    className="w-full sm:w-40 h-12 text-base sm:text-lg"
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            {!currentRecording && !isRecording && (
              <div className="text-center text-gray-500 text-sm">
                Click the microphone button to start recording your answer
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AudioRecording;
