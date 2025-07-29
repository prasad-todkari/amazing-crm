import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { ToastSuccess, ToastError } from "../components/common/Toast";
import useFeedbackQuestions from "../hooks/feedbackQuestions";
import confetti from "canvas-confetti"
import { useGuestAutoFill } from "../components/feedback/useGuestAutoFill";
import { validateForm } from "../components/common/validateForm";
import { submitFeedback } from "../services/FeedbackServices";
import InputField from "../components/feedback/InputField";
import SatisfactionButtons from "../components/feedback/SatisfactionButtons";
import CommentBox from "../components/feedback/CommentBox";

const CustomerFeedback = () => {
  const commentRef = useRef(null);
  const { questions, loading: questionsLoading, error, siteId } = useFeedbackQuestions();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const stored = localStorage.getItem("feedbackQuestions");
  const parsed = stored ? JSON.parse(stored) : null;
  const sitename = parsed?.siteName.site_name || "";

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });

    if (phone.length === 10 && !hasLookedUp) {
      checkGuestByPhone(phone);
      setHasLookedUp(true);
    } else {
      setHasLookedUp(false); // reset if length goes below 10
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone.length === 10 && !hasLookedUp) {
      checkGuestByPhone(formData.phone);
      setHasLookedUp(true);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    phone: "",
    email: "",
    satisfaction: null,
    comment: "",
    ratings: Array(5).fill(0)
  });

  const { hasLookedUp, setHasLookedUp, checkGuestByPhone } = useGuestAutoFill(setFormData, setToastMessage);

  useEffect(() => {
    // Set initial ratings if questions are present
    if (questions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        ratings: Array(questions.length).fill(0),
      }));
    }

    // Timers for toast and error messages
    const timers = [];

    if (toastMessage) {
      const toastTimer = setTimeout(() => {
        setToastMessage('');
      }, 3000);
      timers.push(toastTimer);
    }

    if (errorMessage) {
      const errorTimer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      timers.push(errorTimer);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [questions, toastMessage, errorMessage]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, questions);
    setErrors(validationErrors); // still use local state to display errors

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!siteId || !Array.isArray(formData.ratings)) {
      setErrorMessage("Invalid submission data.");
      return;
    }

    const hasInvalidRatings = formData.ratings.some(r => r < 1 || r > 5);
    if (hasInvalidRatings) {
      setErrorMessage("Please provide valid ratings for all questions.");
      return;
    }

    setLoading(true);

    try {
      const feedbackPayload = {
        name: formData.name.trim(),
        id: formData.id.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        satisfaction: formData.satisfaction,
        comment: formData.comment.trim(),
        siteId,
        ratings: questions.map((q, index) => ({
          question_id: q.question_id,
          rating: formData.ratings[index]
        })),
        submittedAt: new Date().toISOString(),
      };

      const result = await submitFeedback(feedbackPayload)
      if (result.status === 'success') {
        setToastMessage(result.message)
      } else {
        setErrorMessage(result.message)
      }

      setFormData({
        name: "",
        id: "",
        phone: "",
        email: "",
        satisfaction: null,
        comment: "",
        ratings: Array(questions.length).fill(0),
      });
    } catch (error) {
      console.error("Feedback submission error:", error);
      setErrorMessage("Failed to submit feedback. Please try again.");
    }
    setLoading(false);
  };

  const handleRatingChange = (questionIndex, rating) => {
    const newRatings = [...formData.ratings];
    newRatings[questionIndex] = rating;
    setFormData({ ...formData, ratings: newRatings });
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"} transition-colors duration-200`} fill="currentColor"
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSatisfactionClick = (value) => {
    setFormData({ ...formData, satisfaction: value });

    if (value === "satisfied") {
      setFormData((prev) => ({
        ...prev,
        ratings: Array(questions.length).fill(5),
      }));

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else if (value === "not_satisfied") {
      // Set all ratings to 0
      setFormData((prev) => ({
        ...prev,
        ratings: Array(questions.length).fill(0),
      }));
    }

    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white border border-red-300 p-6 rounded shadow text-red-600 text-center">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">Customer Feedback</h2>
        <h5 className="text-md text-center underline underline-offset-8 mb-8">Location Name: {sitename}</h5>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              placeholder="xxxxxxxxxx (without +91)"
              error={errors.phone}
              inputMode="numeric"
              pattern="\d*"
            />
            <InputField
              label="Full Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              error={errors.name}
              required
            />
            <InputField
              label="ID No"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              placeholder="Enter ID"
              error={errors.id}
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@domain.com"
              error={errors.email}
            />
          </div>

          <SatisfactionButtons
            value={formData.satisfaction}
            onClick={handleSatisfactionClick}
            error={errors.satisfaction}
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Rate our services</label>
            {questionsLoading ? (
              <div className="text-center text-gray-600">Loading questions...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:max-h-96 md:overflow-y-auto">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-700 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="mb-2 text-sm font-medium text-white">{q.question_text}</p>
                    <StarRating
                      rating={formData.ratings[index] || 0}
                      onRatingChange={(newRating) => handleRatingChange(index, newRating)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <CommentBox
            value={formData.comment}
            onChange={e => setFormData({ ...formData, comment: e.target.value.slice(0, 500) })}
            refProp={commentRef}
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium 
                rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-slate-500 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
      {errorMessage && (
        <ToastError message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {toastMessage && (
        <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
      )}

    </div>
  );
};

export default CustomerFeedback;


