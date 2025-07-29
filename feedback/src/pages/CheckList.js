import { useState, useEffect } from "react";
import useQuery from "../hooks/useQuery";
import { getFormData } from "../services/ChekListServices";
import SectionProgress from "../components/CheckList/SectionProgress";
import QuestionItem from "../components/CheckList/QuestionItem";
import NavigationButtons from "../components/CheckList/NavigationButtons";

const ChecklistForm = () => {
  const query = useQuery();
  const formId = query.get("formId");
  const siteId = query.get("siteId");

  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const storageKey = `checklist_${formId}`;

useEffect(() => {
  // Step 1: Load saved state BEFORE anything else
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.responses) setResponses(parsed.responses);
      if (typeof parsed.sectionIndex === "number") setSectionIndex(parsed.sectionIndex);
      console.log("✅ Restored from localStorage", parsed);
    } catch (e) {
      console.error("Failed to parse saved data", e);
    }
  }
}, [storageKey]);

useEffect(() => {
  // Step 2: Fetch form from API (title + questions)
  const loadForm = async () => {
    try {
      const result = await getFormData({ formId, siteId });
      setFormTitle(result.data.title);
      setQuestions(result.data.questions);
    } catch (err) {
      setError("Unable to load form: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  loadForm();
}, [formId, siteId]);

useEffect(() => {
  // Step 3: Persist any changes to localStorage
  if (!formId) return;
  const dataToSave = {
    responses,
    sectionIndex
  };
  localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  console.log("💾 Saved to localStorage:", dataToSave);
}, [responses, sectionIndex, formId, storageKey]);

  const sections = [...new Set(questions.map(item => item.section))];
  const currentSection = sections[sectionIndex]  || sections[0];
  const sectionQuestions = questions.filter(q => q.section === currentSection);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        response: value,
      }
    }));
  };

  const handleImageChange = (questionId, file) => {
    const imageUrl = URL.createObjectURL(file);
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        image: imageUrl,
        file, 
      }
    }));
  };

  const validateSection = () => {
    for (let q of sectionQuestions) {
      const res = responses[q.chkque_id];
      if (!res?.response) {
        return { valid: false, message: `Please answer the question: "${q.question}"` };
      }
      if (q.isimg_require === true && !res?.image) {
        return { valid: false, message: `Please upload the required image for: "${q.question}"` };
      }
    }
    return { valid: true };
  };

  const handleNext = () => {
    const result = validateSection();
    if (!result.valid) {
      alert(result.message);
      return;
    }
    setSectionIndex(prev => prev + 1);
  };

  const handleSubmit = () => {
    const result = validateSection();
    if (!result.valid) {
      alert(result.message);
      return;
    }

    const payload = {
      formId,
      siteId,
      totalScore: 0,
      responses: []
    };

    questions.forEach(q => {
      const res = responses[q.chkque_id];
      if (!res) return;

      const answeredYes = res.response === "Yes";
      const score = answeredYes ? q.score || 0 : 0;

      payload.responses.push({
        chkque_id: q.chkque_id,
        sect_id: q.sect_id,
        question: q.question,
        response: res.response,
        imageUrl: res.image || null,
        score
      });

      payload.totalScore += score;
    });

    console.log("Payload to submit:", payload);
    alert("Form submitted successfully!");
    localStorage.removeItem(storageKey);
  };

  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => {
    const res = responses[q.chkque_id];
    if (!res?.response) return false;
    if (q.isimg_require === true && !res?.image) return false;
    return true;
  }).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  if (loading) return <p className="text-center mt-8">Loading form...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <SectionProgress
          progress={progress}
          section={sectionIndex + 1}
          total={sections.length}
          title={formTitle}
        />

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">{currentSection}</h2>

          {sectionQuestions.map((item, idx) => (
            <QuestionItem
              key={item.chkque_id}
              item={item}
              response={responses[item.chkque_id]}
              onRespond={(val) => handleResponse(item.chkque_id, val)}
              onImageUpload={(file) => handleImageChange(item.chkque_id, file)}
            />
          ))}

          <NavigationButtons
            isFirst={sectionIndex === 0}
            isLast={sectionIndex === sections.length - 1}
            onPrevious={() => setSectionIndex(prev => prev - 1)}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};


export default ChecklistForm;
