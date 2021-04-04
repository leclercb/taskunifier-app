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

export function onCommitForm(form, object, updateObject, options) {
    options = merge({
        assign: false,
        force: false,
        convert: null
    }, options || {});

    setTimeout(async () => {
        const update = values => {
            let newObject;

            if (options && options.assign === true) {
                Object.assign(object, values);
                newObject = object;
            } else {
                newObject = merge({ ...object }, values);
            }

            if (options && options.convert) {
                newObject = options.convert(newObject);
            }

            updateObject(newObject);
        };

        try {
            const values = await form.validateFields();
            update(values);
        } catch (error) {
            if (error && options && options.force === true) {
                update(error.values);
            }
        }
    });
}