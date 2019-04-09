import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Empty } from 'antd';
import withContexts from '../../containers/WithContexts';
import ContextList from './ContextList';
import ContextForm from './ContextForm';

function ContextManager(props) {
    const selectedContextId = props.contextId;

    const onContextSelection = context => {
        props.onContextSelection(context.id);
    }

    const selectedContext = props.contexts.find(context => context.id === selectedContextId);

    return (
        <Row>
            <Col span={6}>
                <ContextList
                    contexts={props.contexts}
                    selectedContextId={selectedContextId}
                    addContext={props.addContext}
                    deleteContext={props.deleteContext}
                    onContextSelection={onContextSelection} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={16}>
                {selectedContext ? (
                    <ContextForm key={selectedContextId} context={selectedContext} updateContext={props.updateContext} />
                ) : <Empty />}
            </Col>
        </Row>
    );
}

ContextManager.propTypes = {
    contextId: PropTypes.string,
    onContextSelection: PropTypes.func.isRequired
}

export default withContexts(ContextManager);