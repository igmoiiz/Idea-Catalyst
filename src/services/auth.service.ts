import api from '../api/axios';

export const authService = {
    async register(username: string, email: string, password: string) {
        const response = await api.post('/auth/register', {
            name: username,
            email,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async login(email: string, password: string) {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user') || 'null');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};
