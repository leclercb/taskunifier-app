import { merge } from 'utils/ObjectUtils';

export function getDefaultFormItemLayout() {
    return {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 10 },
            xl: { span: 8 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
            xl: { span: 12 }
        }
    };
}

export function getDefaultTailFormItemLayout() {
    return {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 14,
                offset: 10
            },
            xl: {
                span: 10,
                offset: 8
            }
        }
    };
}

export function onCommitForm(form, object, updateObject, options = { assign: false, force: false }) {
    setTimeout(() => {
        form.validateFields((error, values) => {
            if (error && (!options || options.force !== true)) {
                return;
            }

            if (options && options.assign === true) {
                Object.assign(object, values);
                updateObject(object);
            } else {
                updateObject(merge({ ...object }, values));
            }
        });
    });
}