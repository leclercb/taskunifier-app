import moment from 'moment';
import RichTextEditor from 'react-rte';

export function convertWeirdToodledoTimestampToRemote(value) {
    if (!value) {
        return 0;
    }

    const localM = moment(value);
    const utcM = moment.utc(localM);

    utcM.set('second', localM.get('second'));
    utcM.set('minute', localM.get('minute'));
    utcM.set('hour', localM.get('hour'));

    return utcM.unix();
}

export function convertWeirdToodledoTimestampToLocal(value) {
    if (!value) {
        return null;
    }

    const localM = moment.unix(value);
    const utcM = moment.utc(localM);

    localM.set('second', utcM.get('second'));
    localM.set('minute', utcM.get('minute'));
    localM.set('hour', utcM.get('hour'));

    return localM.toISOString();
}

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