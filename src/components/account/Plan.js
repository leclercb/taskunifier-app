import React from 'react';
import { Button, Col, List, Typography } from 'antd';
import PropTypes from 'prop-types';

function Plan({ plan, onSelectPlan }) {
    const getFeaturesFromPlan = plan => {
        switch (plan.nickname) {
            case 'Free':
                return [
                    (<strong key={0}>100 Tasks</strong>),
                    (<strong key={1}>10 Notes</strong>),
                    '10 Contacts',
                    '10 Contexts',
                    '10 Folders',
                    '10 Goals',
                    '10 Locations'
                ];
            case 'Monthly':
                return [
                    (<strong key={0}>10000 Tasks</strong>),
                    (<strong key={1}>1000 Notes</strong>),
                    '100 Contacts',
                    '100 Contexts',
                    '100 Folders',
                    '100 Goals',
                    '100 Locations',
                    '100 Note Filters',
                    '100 Task Filters',
                    '10 Custom Note Fields',
                    '10 Custom Task Fields',
                    '100 Task Templates'
                ];
            case 'Yearly':
                return [
                    (<strong key={0}>10000 Tasks</strong>),
                    (<strong key={1}>1000 Notes</strong>),
                    '100 Contacts',
                    '100 Contexts',
                    '100 Folders',
                    '100 Goals',
                    '100 Locations',
                    '100 Note Filters',
                    '100 Task Filters',
                    '10 Custom Note Fields',
                    '10 Custom Task Fields',
                    '100 Task Templates'
                ];
            default:
                return [];
        }
    };

    const features = getFeaturesFromPlan(plan);

    return (
        <Col span={12}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 20,
                border: '3px solid #cccccc',
                borderRadius: 10,
                textAlign: 'center',
                height: '100%'
            }}>
                <Typography.Title level={3}>{plan.nickname}</Typography.Title>
                <div style={{ margin: 20 }}>
                    <List
                        dataSource={features}
                        size="small"
                        bordered={false}
                        renderItem={item => (
                            <List.Item>
                                <span>{item}</span>
                            </List.Item>
                        )} />
                </div>
                <div style={{ marginTop: 'auto' }}>
                    {plan.id === 'free' && (
                        <Typography.Title level={4}>Free</Typography.Title>
                    )}
                    {plan.id !== 'free' && (
                        <Typography.Title level={4}>
                            {(plan.amount / 100).toFixed(2)} <span style={{ fontWeight: 'normal' }}>{plan.currency} per {plan.interval}</span>
                        </Typography.Title>
                    )}
                    {onSelectPlan && (
                        <Button
                            type="primary"
                            onClick={() => onSelectPlan(plan, plan.amount)}>
                            Select this plan
                        </Button>
                    )}
                </div>
            </div>
        </Col>
    );
}

Plan.propTypes = {
    plan: PropTypes.object.isRequired,
    onSelectPlan: PropTypes.func
};

export default Plan;