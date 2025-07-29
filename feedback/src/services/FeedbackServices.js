import axiosInstance from "./axiosInstance";

export const getGuestByPhone = async (phone) => {
  const resp =  await axiosInstance.get(`/api/feedback/guest?phone=${phone}`);
  return resp.data
};

export const submitFeedback = async (feedbackPayload) => {
  try {
    const reponse = await axiosInstance.post(`/api/feedback/submitFeedback`, feedbackPayload);
    return reponse.data
  } catch (error) {
    throw error
  }
}

export const getKpiCard = async () => {
  try {
    const reponse = await axiosInstance.get(`/api/dash/getKpiCard`)
    return reponse.data
  } catch (error) {
    throw error
  }
}

export const getDayWiseData = async () => {
  try {
    const responce = await axiosInstance.get(`/api/dash/getDayWise`)
    return responce.data
  } catch (error) {
    throw error
  }
}

export const getSiteWiseData = async () => {
  try {
    const responce = await axiosInstance.get(`/api/dash/getSiteWise`)
    return responce.data
  } catch (error) {
    throw error
  }
}

export const getRecentFeedback = async () => {
  try {
    const resp = await axiosInstance.get(`/api/dash/getRecentFeedacks`)
    return resp.data
  } catch (error) {
    throw error
  }
}

export const getMostAnswered = async () => {
  try {
    const result = await axiosInstance.get(`/api/dash/getMostAnswered`)
    return result.data
  } catch (error) {
    throw error
  }
}

export const getFeedbackDetails = async () => {
  try {
    const resp = await axiosInstance.get(`/api/dash/getFeedbackDetails`)
    return resp.data
  } catch (error) {
    throw error
  }
}