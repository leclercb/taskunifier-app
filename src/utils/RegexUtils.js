export function escape(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};