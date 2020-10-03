import moment, {Moment} from "moment";

export function getCurrentFormattedDate() {
    return moment().format("YYYY-MM-DD")
}

export function formatDate(date: Moment) {
    return date.format("YYYY-MM-DD")
}

export function isCurrentDay(date: string) {
    return getCurrentFormattedDate() == date
}
