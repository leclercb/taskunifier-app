export function checkResult(result) {
    if ('errorCode' in result.data) {
        throw new Error(`${result.data.errorCode}: ${result.data.errorDesc}`);
    }

    if (Array.isArray(result.data)) {
        for (let item of result.data) {
            if ('errorCode' in item) {
                throw new Error(`${item.errorCode}: ${item.errorDesc}`);
            }
        }
    }
}