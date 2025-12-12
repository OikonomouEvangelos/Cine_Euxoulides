// 1. Get the raw token string from Local Storage
export const getToken = () => {
    return localStorage.getItem('token');
};

// 2. Create the Header object for fetch requests
export const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// 3. Decode the token to find the User ID
export const getCurrentUserId = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload.id;
    } catch (e) {
        console.error("Error decoding token", e);
        return null;
    }
};

// 4. Simple check if user is logged in
export const isAuthenticated = () => {
    return !!getToken();
};