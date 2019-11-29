import RichTextEditor from 'react-rte';

export function convertTextToRemote(value) {
    return RichTextEditor.createValueFromString(value || '', 'markdown').getEditorState().getCurrentContent().getPlainText();
}

export function convertTextToLocal(value) {
    value = (value || '').replace(/\r?\n/g, '<br />');
    return RichTextEditor.createValueFromString(value || '', 'html').toString('markdown');
}