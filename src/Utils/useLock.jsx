import { useState, useEffect } from 'react';
function formatDate(date) {
    if (!date) return '';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);

    const seconds = `0${date.getSeconds()}`.slice(-2);

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

function useClock() {
    const [timeString, setTimeString] = useState();
    useEffect(() => {
        const clockInterval = setInterval(() => {
            const now = new Date();
            // HH: mm:ss
            const newTimeString = formatDate(now);
            setTimeString(newTimeString);
        }, 1000);
        return () => {
            // cleanup
            clearInterval(clockInterval);
        };
    }, []);

    return timeString;
}

export default useClock;
