export function checkResult(result) {
    if ('errorCode' in result.data) {
        throw new Error(result.data.errorDesc);
    }
}