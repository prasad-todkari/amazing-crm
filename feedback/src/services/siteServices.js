import axiosInstance from "./axiosInstance";

export const getAllSites = async () => {
  try {
    const response = await axiosInstance.get('/api/master/getSite');
    return response.data;
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
}

export const addSite = async (siteData) => {
  try {
    const response = await axiosInstance.post('/api/master/addSite', siteData);
    return response.data;
  } catch (error) {
    console.error('Error adding site:', error);
    throw error;
  }
}

export const editSite = async (siteData) => {
  try {
    const response = await axiosInstance.post(`/api/master/editSite`, siteData);
    return response.data;
  } catch (error) {
    console.error('Error editing site:', error);
    throw error;
  }
}

export const getQuestions = async ({site_id}) => {
  try {
    const response = await axiosInstance.get(`api/master/getSiteQuestions`, {params: { site_id }})
    return response.data;
  } catch (error) {
    console.error('Error fetching Site Questions', error)
    throw error
  }
}

export const selectedQuestions = async ({siteId, selectedIds}) => {
  try {
    const response = await axiosInstance.post('api/master/addSelectedQue', {siteId, selectedIds})
    return response
  } catch (error) {
    console.error('Error fetching Site Questions', error)
    throw error
  }
}

export const getSiteSelectedQ = async (siteId) => {
  try {
    const resp = await axiosInstance.get('api/master/siteQuestions', {params: { siteId }})
    return resp.data
  } catch (error) {
    console.error(`error fetching site selected questions`, error)
    throw error
  }
}

export const getSiteName = async (siteId) => {
  try {
    const response = await axiosInstance.get('/api/master/getSiteName', { params: { siteId } });
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching site name:', error);
    throw error;
  }
}

export const getUserAccess = async () => {
  try {
    const response = await axiosInstance.get('/api/master/getUserAccess')
    return response.data
  } catch (error) {
    console.error('error while getting user Access:', error)
    throw new Error()
  }
}