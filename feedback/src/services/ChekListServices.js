import axiosInstance from "./axiosInstance";

// api/formService.js
export const getFormData = async ({formId, siteId}) => {
  // Simulated API call — replace with real fetch
 try {
    const resp = await axiosInstance.get('/api/checklist/getFormDetails',  {
            params: {formId, siteId}
        });
    return resp.data    
 } catch (error) {
    throw new Error('No Data Found')
 }
};



