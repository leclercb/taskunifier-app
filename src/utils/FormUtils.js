export const getDefaultFormItemLayout = () => {
    return {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
            md: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
            md: { span: 10 }
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
                span: 16,
                offset: 8
            },
            ms: {
                span: 10,
                offset: 4
            }
        }
    };
};