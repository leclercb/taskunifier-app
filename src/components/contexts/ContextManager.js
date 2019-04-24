import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withContexts from 'containers/WithContexts';
import ContextList from 'components/contexts/ContextList';
import ContextForm from 'components/contexts/ContextForm';

function ContextManager(props) {
    const selectedContextId = props.contextId;

    const onAddContext = context => {
        props.addContext(context).then(id => props.onContextSelection(id));
    };

    const onContextSelection = context => {
        props.onContextSelection(context.id);
    };

    const selectedContext = props.contexts.find(context => context.id === selectedContextId);

    return (
        <Row>
            <Col span={6}>
                <ContextList
                    contexts={props.contexts}
                    selectedContextId={selectedContextId}
                    addContext={onAddContext}
                    deleteContext={props.deleteContext}
                    onContextSelection={onContextSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedContext ? (
                    <ContextForm key={selectedContextId} context={selectedContext} updateContext={props.updateContext} />
                ) : <Empty description="Please select a context" />}
            </Col>
        </Row>
    );
}

ContextManager.propTypes = {
    contextId: PropTypes.string,
    onContextSelection: PropTypes.func.isRequired
};

export default withContexts(ContextManager);