import axiosInstance from './axiosInstance';

export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get('api/master/getCategories');
        return response.data;        
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;        
    }
  }

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('api/master/getUsers');
        return response.data;        
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;        
    }
}

export const addNewUser = async (userData) => {
    try {
        const response = await axiosInstance.post('api/master/addUser', userData);
        return response.data;        
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;        
    }
}

export const editUser = async (userData) => {
    try {
        const response = await axiosInstance.post('api/master/editUser', userData);
        return response.data;        
    } catch (error) {
        console.error('Error editing user:', error);
        throw error;        
    }
}