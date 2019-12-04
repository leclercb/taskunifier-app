import moment from 'moment';
import RichTextEditor from 'react-rte';

export function convertWeirdToodledoTimestampToRemote(value) {
    if (!value) {
        return 0;
    }

    const local = moment(value);
    const utc = moment.utc(local);

    utc.set({
        second: local.get('second'),
        minute: local.get('minute'),
        hour: local.get('hour'),
        date: local.get('date'),
        month: local.get('month'),
        year: local.get('year')
    });

    return utc.unix();
}

export function convertWeirdToodledoTimestampToLocal(value) {
    if (!value) {
        return null;
    }

    const local = moment.unix(value);
    const utc = moment.utc(local);

    local.set({
        second: utc.get('second'),
        minute: utc.get('minute'),
        hour: utc.get('hour'),
        date: utc.get('date'),
        month: utc.get('month'),
        year: utc.get('year')
    });

    return local.toISOString();
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