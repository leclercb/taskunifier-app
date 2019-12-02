import moment from 'moment';
import RichTextEditor from 'react-rte';

export function convertTextToRemote(value) {
    let result = RichTextEditor.createValueFromString(value || '', 'markdown').toString('html');

    result = result.replace(/<br\s*\/?>/g, '\n');
    result = result.replace(/<p>/g, '');
    result = result.replace(/<\/p>/g, '\n\n');

    result = replaceTag('strong', 'b', result);
    result = replaceTag('em', 'i', result);

    return result;
}

export function convertTextToLocal(value) {
    value = (value || '').replace(/\r?\n/g, '<br />');
    return RichTextEditor.createValueFromString(value || '', 'html').toString('markdown');
}

export function replaceTag(tagA, tagB, value) {
    let result = value;
    result = result.replace(new RegExp(`<${tagA}>`, 'g'), `<${tagB}>`);
    result = result.replace(new RegExp(`</${tagA}>`, 'g'), `</${tagB}>`);
    return result;
}

export function convertWeirdToodledoTimestampToRemote(value) {
    const utcM = moment.utc(value);
    const localM = moment(value);

    utcM.set('second', localM.get('second'));
    utcM.set('minute', localM.get('minute'));
    utcM.set('hour', localM.get('hour'));

    return value ? utcM.unix() : 0;
}

export function convertWeirdToodledoTimestampToLocal(value) {
    // TODO
    return value ? moment.unix(value).toISOString() : null;
}