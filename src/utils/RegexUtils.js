export const escape = s => {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};