import moment from "moment";

export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const parseDatesInArray = (array) => {
    return array.map((item) => (moment(item.checkTime).format("HH:mm:ss")));
}