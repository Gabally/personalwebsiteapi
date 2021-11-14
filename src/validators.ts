import { URL } from "url";

const isDefined = (obj: any) => {
    return obj !== null && obj !== undefined;
}

export default {
    length(field: string, max: number) {
        return isDefined(field) && field.length <= max;
    },
    isNotNull(field: string) {
        return isDefined(field) && field.length !== 0;
    },
    isNumber(field: string) {
        return isDefined(field) && !isNaN(parseInt(field));
    },
    verifyArrayStructure(data: any[], validator: {(e: any): boolean}) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (!validator(element)) {
                return false;
            }
        }
        return true;
    },
    isURL(field: string) {
        try {
            new URL(field);
            return true;
        } catch (error) {
            return false;
        }
    }
}