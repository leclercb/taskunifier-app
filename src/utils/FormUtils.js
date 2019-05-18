import { merge, setValue } from 'utils/ObjectUtils';

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
            xl: { span: 10 }
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

export function onFieldChangeForObjectUpdates(fields, object, updateObject, assign = false) {
    const values = {};
    const errors = [];
    let validating = false;

    flattenFields(null, fields).forEach(field => {
        setValue(values, field.name, field.value);
        errors.push(...(field.errors || []));

        if (field.validating) {
            validating = true;
        }
    });

    if (errors.length === 0 && !validating) {
        if (assign) {
            Object.assign(object, values);
            updateObject(object);
        } else {
            const updatedObject = merge({ ...object }, values);
            updateObject(updatedObject);
        }
    }
}

function flattenFields(path, object) {
    if (typeof object !== 'object') {
        return [];
    }

    if ('name' in object && 'value' in object && object.name === path) {
        return [object];
    }

    const array = [];

    Object.keys(object).forEach(key => {
        array.push(...flattenFields((path ? path + '.' : '') + key, object[key]));
    });

    return array;
}