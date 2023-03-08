import httpClient from './httpClient.component';

function intervalService() {
    const request = httpClient();

    return {
        get: (data) => request.get(`intervals?id=${data}`),
    }
}

export default intervalService;