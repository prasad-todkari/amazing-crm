import axiosInstance from "./axiosInstance";

export const getFormData = async ({formId, siteId}) => {
 try {
    const resp = await axiosInstance.get('/api/checklist/getFormDetails',  {
            params: {formId, siteId}
        });
    return resp.data    
 } catch (error) {
    throw new Error('No Data Found')
 }
};

export const submitChecklist = async (payload) => {
   try {
      const result = await axiosInstance.post('/api/checklist/addChecklist', payload)
      return result
   } catch (error) {
      throw new Error('Error while adding cheklist', error)
   }
}

export const getDayChecklist = async () => {
   try {
      const result = await axiosInstance.get('api/checklist/getDayChecklist')
      return result.data
   } catch (error) {
      throw new Error('no data found', error.message)
   }
}


