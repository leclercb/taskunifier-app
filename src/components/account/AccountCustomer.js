import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useStripeApi } from 'hooks/UseStripeApi';
import { getDefaultFormItemLayout, getDefaultTailFormItemLayout } from 'utils/FormUtils';

function AccountCustomer({ customer, onCustomerUpdated }) {
    const stripeApi = useStripeApi();

    const [busy, setBusy] = useState(false);
    const [form] = Form.useForm();

    const formItemLayout = getDefaultFormItemLayout();
    const tailFormItemLayout = getDefaultTailFormItemLayout();

    useEffect(() => {
        form.resetFields();
    }, [customer]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();

            try {
                setBusy(true);
                const customer = await stripeApi.setCurrentCustomer(values);
                onCustomerUpdated(customer);
            } finally {
                setBusy(false);
            }
        } catch (error) {
            // Skip
        }
    };

    if (customer) {
        customer = {
            ...customer,
            tax_id: customer.tax_ids.data.length !== 0 ? customer.tax_ids.data[0] : null
        };
    }

    return (
        <Spin spinning={busy}>
            <Form form={form} initialValues={customer} {...formItemLayout}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'The name is required'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Your email is required'
                        },
                        {
                            type: 'email',
                            message: 'The email is invalid'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Address">
                    <div style={{ padding: 20, border: '1px solid #cccccc', borderRadius: 5 }}>
                        <Form.Item
                            name={['address', 'line1']}
                            label="Line 1"
                            rules={[
                                {
                                    required: true,
                                    message: 'Line 1 is required'
                                }
                            ]}
                            {...formItemLayout}>
                            <Input placeholder="Line 1" />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'line2']}
                            label="Line 2"
                            {...formItemLayout}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'city']}
                            label="City"
                            rules={[
                                {
                                    required: true,
                                    message: 'Your city is required'
                                }
                            ]}
                            {...formItemLayout}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'postal_code']}
                            label="Postal Code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Your postal code is required'
                                }
                            ]}
                            {...formItemLayout}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'state']}
                            label="State"
                            {...formItemLayout}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'country']}
                            label="Country"
                            rules={[
                                {
                                    required: true,
                                    message: 'Your country is required'
                                }
                            ]}
                            {...formItemLayout}>
                            <Input />
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item label="Tax ID">
                    <div style={{ padding: 20, border: '1px solid #cccccc', borderRadius: 5 }}>
                        <Form.Item
                            name={['tax_id', 'type']}
                            label="Type"
                            {...formItemLayout}>
                            <Select placeholder="Type">
                                <Select.Option value="eu_vat">European VAT number</Select.Option>
                                <Select.Option value="in_gst">Indian GST number</Select.Option>
                                <Select.Option value="au_abn">Australian Business Number</Select.Option>
                                <Select.Option value="nz_gst">New Zealand GST number</Select.Option>
                                <Select.Option value="no_vat">Norwegian VAT number</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['tax_id', 'value']}
                            label="Value"
                            {...formItemLayout}>
                            <Input placeholder="Value" />
                        </Form.Item>
                        <Form.Item
                            label="Verification Status"
                            {...formItemLayout}>
                            {customer && customer.tax_id && customer.tax_id.verification ? customer.tax_id.verification.status : ''}
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
    onCustomerUpdated: PropTypes.func
};

export default AccountCustomer; 