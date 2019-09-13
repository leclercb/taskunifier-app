import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import ContextList from 'components/contexts/ContextList';
import ContextForm from 'components/contexts/ContextForm';
import { useContextApi } from 'hooks/UseContextApi';

function ContextManager(props) {
    const contextApi = useContextApi();
    const selectedContextId = props.contextId;

    const onAddContext = async context => {
        context = await contextApi.addContext(context);
        props.onContextSelection(context.id);
    };

    const onDuplicateContext = async context => {
        context = await contextApi.duplicateContext(context);
        props.onContextSelection(context.id);
    };

    const onContextSelection = context => {
        props.onContextSelection(context.id);
    };

    const selectedContext = contextApi.contexts.find(context => context.id === selectedContextId);

    return (
        <Row>
            <Col span={6}>
                <ContextList
                    contexts={contextApi.contexts}
                    selectedContextId={selectedContextId}
                    addContext={onAddContext}
                    duplicateContext={onDuplicateContext}
                    deleteContext={contextApi.deleteContext}
                    onContextSelection={onContextSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedContext ? (
                    <ContextForm key={selectedContextId} context={selectedContext} updateContext={contextApi.updateContext} />
                ) : <Empty description="Please select a context" />}
            </Col>
        </Row>
    );
}

ContextManager.propTypes = {
    contextId: PropTypes.string,
    onContextSelection: PropTypes.func.isRequired
};

export default ContextManager;