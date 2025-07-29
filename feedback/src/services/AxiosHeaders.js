const AxiosHeaders = () => {    
    const token = localStorage.getItem('token'); // <-- moved inside
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',   
        'Accept': 'application/json'
    };
};

export default AxiosHeaders;