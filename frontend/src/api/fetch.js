import axios from "axios";

const getAccessToken = () => {
  return localStorage.getItem("accessToken") || "";
};

// POST without token
export const postWithoutToken = async (data, endPoint, customHeaders = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const resp = await axios.post(endPoint, data, {
      headers: defaultHeaders,
    });

   
    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// POST with token
export const postWithToken = async (data, endPoint, customHeaders = {}) => {
  const token = getAccessToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  };

  try {
    const resp = await axios.post(endPoint, data, {
      headers: defaultHeaders,
    });

    
    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// GET without token
export const getWithoutToken = async (endPoint, params = {}, customHeaders = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const resp = await axios.get(endPoint, {
      params,
      headers: defaultHeaders,
    });

    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// GET with token
export const getWithToken = async (endPoint, params = {}, customHeaders = {}) => {
  const token = getAccessToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  };

  try {
    const resp = await axios.get(endPoint, {
      params,
      headers: defaultHeaders,
    });

  
    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// PUT without token
export const putWithoutToken = async (data, endPoint, customHeaders = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const resp = await axios.put(endPoint, data, {
      headers: defaultHeaders,
    });

    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// PUT with token
export const putWithToken = async (data, endPoint, customHeaders = {}) => {
  const token = getAccessToken();
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  };
 
  try {
    const resp = await axios.put(endPoint, data, {
      headers: defaultHeaders,
    });

    return resp.data;
    
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// DELETE without token
export const deleteWithoutToken = async (endPoint, params = {}, customHeaders = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const resp = await axios.delete(endPoint, {
      params,
      headers: defaultHeaders,
    });

    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// DELETE with token
export const deleteWithToken = async (endPoint, params = {}, customHeaders = {}) => {

  const token = getAccessToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  };

  try {
    const resp = await axios.delete(endPoint, {
      params,
      headers: defaultHeaders,
    });

    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};


// DELETE with token
export const deleteWithTokenandBody = async (data, endPoint) => {
 
  const token = getAccessToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  try {
    const resp = await axios.delete(endPoint, {
      data,
      headers: defaultHeaders,
    });

    return resp.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
