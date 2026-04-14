let eventSourse;

export const initSSE = (url) => {
    if (!eventSourse) {
        eventSourse = new EventSource(
            url, {
            withCredentials: true
        });
    }

    return eventSourse;
}