async function requestAPI(endpoint, method = 'GET', bodyData = null) {
    const token = localStorage.getItem('access_token');

    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (bodyData) {
        config.body = JSON.stringify(bodyData);
    }

    const response = await fetch(`http://127.0.0.1:8000${endpoint}`, config);

    return response;
}