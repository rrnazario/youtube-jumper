import httpClient from './httpClient.component';

function intervalService() {
    const request = httpClient();

    return {
        get: (data) => request.get(`intervals/${data}`),
        add: (id, data) => request.put(`intervals/${id}`, data),
    }
}

export default intervalService;