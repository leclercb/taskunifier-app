import React, { useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useStripeApi } from 'hooks/UseStripeApi';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';

function AccountCustomer({ customer, onCustomerUpdated, form }) {
    const stripeApi = useStripeApi();

    const [busy, setBusy] = useState(false);

    const taxId = customer && customer.tax_ids.data.length !== 0 ? customer.tax_ids.data[0] : null;

    const onSubmit = () => {
        form.validateFields(async (error, values) => {
            if (error) {
                return;
            }

            try {
                setBusy(true);
                const customer = await stripeApi.setCurrentCustomer(values);
                onCustomerUpdated(customer);
            } finally {
                setBusy(false);
            }
        });
    };

    const { getFieldDecorator } = form;

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    return (
        <Spin spinning={busy}>
            <Form {...formItemLayout}>
                <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        initialValue: customer ? customer.name : undefined,
                        rules: [
                            {
                                required: true,
                                message: 'The name is required'
                            }
                        ]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Email">
                    {getFieldDecorator('email', {
                        initialValue: customer ? customer.email : undefined,
                        rules: [
                            {
                                required: true,
                                message: 'Your email is required'
                            },
                            {
                                type: 'email',
                                message: 'The email is invalid'
                            }
                        ]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Address">
                    <div style={{ padding: 20, border: '1px solid #cccccc', borderRadius: 5 }}>
                        <Form.Item label="Line 1" {...formItemLayout}>
                            {getFieldDecorator('address.line1', {
                                initialValue: customer && customer.address ? customer.address.line1 : undefined,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Line 1 is required'
                                    }
                                ]
                            })(
                                <Input placeholder="Line 1" />
                            )}
                        </Form.Item>
                        <Form.Item label="Line 2" {...formItemLayout}>
                            {getFieldDecorator('address.line2', {
                                initialValue: customer && customer.address ? customer.address.line2 : undefined
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="City" {...formItemLayout}>
                            {getFieldDecorator('address.city', {
                                initialValue: customer && customer.address ? customer.address.city : undefined,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Your city is required'
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="Postal Code" {...formItemLayout}>
                            {getFieldDecorator('address.postalCode', {
                                initialValue: customer && customer.address ? customer.address.postal_code : undefined,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Your postal code is required'
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="State" {...formItemLayout}>
                            {getFieldDecorator('address.state', {
                                initialValue: customer && customer.address ? customer.address.state : undefined
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="Country" {...formItemLayout}>
                            {getFieldDecorator('address.country', {
                                initialValue: customer && customer.address ? customer.address.country : undefined,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Your country is required'
                                    }
                                ]
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item label="Tax ID">
                    <div style={{ padding: 20, border: '1px solid #cccccc', borderRadius: 5 }}>
                        <Form.Item label="Type" {...formItemLayout}>
                            {getFieldDecorator('taxId.type', {
                                initialValue: taxId ? taxId.type : undefined
                            })(
                                <Select placeholder="Type">
                                    <Select.Option value="eu_vat">European VAT number</Select.Option>
                                    <Select.Option value="in_gst">Indian GST number</Select.Option>
                                    <Select.Option value="au_abn">Australian Business Number</Select.Option>
                                    <Select.Option value="nz_gst">New Zealand GST number</Select.Option>
                                    <Select.Option value="no_vat">Norwegian VAT number</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="Value" {...formItemLayout}>
                            {getFieldDecorator('taxId.value', {
                                initialValue: taxId ? taxId.value : undefined
                            })(
                                <Input placeholder="Value" />
                            )}
                        </Form.Item>
                        <Form.Item label="Verification Status" {...formItemLayout}>
                            {taxId ? taxId.verification.status : ''}
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button type="primary" onClick={onSubmit}>
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Spin>
    );
}

AccountCustomer.propTypes = {
    customer: PropTypes.object,
    onCustomerUpdated: PropTypes.func,
    form: PropTypes.object.isRequired
};

export default Form.create({ name: 'customer' })(AccountCustomer); 