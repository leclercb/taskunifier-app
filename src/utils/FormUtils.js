import { merge } from "./ObjectUtils";

export const getDefaultFormItemLayout = () => {
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
};

export const getDefaultTailFormItemLayout = () => {
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
};

export const onFieldChangeForObjectUpdates = (fields, object, updateObject, assign = false) => {
    const values = {};
    let errors = [];
    let validating = false;

    Object.keys(fields).forEach(key => {
        values[key] = fields[key].value;
        errors = errors.concat(fields[key].errors || []);

        if (fields[key].validating) {
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