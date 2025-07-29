export const validateForm = (formData, questions) => {
  const newErrors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    newErrors.name = "Name must be at least 2 characters long";
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }

  if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
    newErrors.phone = "Please enter a valid phone number";
  }

  if (formData.satisfaction === null) {
    newErrors.satisfaction = "Please select your satisfaction level";
  }

  if (!formData.ratings || formData.ratings.length !== questions.length) {
    newErrors.ratings = "Ratings do not match the number of questions.";
  }

  return newErrors;
};
