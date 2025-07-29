import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getSiteName, getSiteSelectedQ } from "../services/siteServices";

const useFeedbackQuestions = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const siteId = query.get("siteId");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // <-- NEW: error state
  const [currentSiteId, setCurrentSiteId] = useState(siteId);

  useEffect(() => {
    if (!siteId) {
      setError("Invalid or missing site ID in the link.");
      return;
    }

    let parsed = null;
    try {
      const stored = localStorage.getItem("feedbackQuestions");
      parsed = stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing localStorage:", err);
      localStorage.removeItem("feedbackQuestions");
    }

    const loadQuestions = async () => {
      setLoading(true);
      try {
        const fetchedQuestions = await getSiteSelectedQ(siteId);
        const questionArray = fetchedQuestions?.data;
        const siteName = await getSiteName(siteId);

        if (!questionArray || !Array.isArray(questionArray) || questionArray.length === 0) {
          throw new Error("No questions returned from API");
        }

        setQuestions(questionArray);
        setCurrentSiteId(siteId);
        setError(null);

        // Save clean data
        localStorage.setItem(
          "feedbackQuestions",
          JSON.stringify({ siteId, siteName, questions: questionArray })
        );
      } catch (err) {
        console.error("Error loading questions:", err);
        setQuestions([]);
        setError("Something went wrong. Please check the link and try again.");
        localStorage.removeItem("feedbackQuestions"); // Clear old/corrupted cache
      }
      setLoading(false);
    };

    if (!parsed || String(parsed.siteId) !== String(siteId)) {
      // Different siteId or no cache → remove old & refetch
      localStorage.removeItem("feedbackQuestions"); // Clear the entire object
      loadQuestions();
    } else {
      setQuestions(parsed.questions || []);
      setCurrentSiteId(parsed.siteId);
      setError(null);
    }
  }, [location.search, siteId]);

  return useMemo(
    () => ({ questions, loading, error, siteId: currentSiteId }),
    [questions, loading, error, currentSiteId]
  );
};

export default useFeedbackQuestions;
