export function removeSpecialChars(str: string): string {
    const pattern = /[^0-9a-zA-Z+]+/g
    return str.replace(pattern, "")
}

export function isNullOrWhitespace(input: string | null): boolean {
    if (typeof input === "string") {
        return !input.trim()
    }
    return !input
}

export const convertStringDateToDate = (stringDate: string) => {
    if (stringDate.length > 4) {
        const dateComponents = stringDate.split("-")
        const date = new Date(
            parseInt(dateComponents[1], 10),
            parseInt(dateComponents[0], 10) - 1,
            1
        )
        return date
    }
    const date = new Date(parseInt(stringDate, 10), 0, 1)
    return date
}

export const convertEucationStringDates = (stringDate: string) => {
    if (stringDate.length > 4) {
        const dateComponents = stringDate.split(" ")
        const monthMap: {
            [key: string]: number
        } = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        }
        const month = monthMap[dateComponents[0]]
        const date = new Date(parseInt(dateComponents[1], 10), month, 1)
        return date
    }
    const date = new Date(parseInt(stringDate, 10), 0, 1)
    return date
}

export function validateEmail(userEmail: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(userEmail)
}
