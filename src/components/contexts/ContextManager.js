import React, { useState } from 'react';
import { Row, Col, Empty } from 'antd';
import withContexts from '../../containers/WithContexts';
import ContextList from './ContextList';
import ContextForm from './ContextForm';

function ContextManager(props) {
    const [selectedContextId, setSelectedContextId] = useState(null);

    const onContextSelection = context => {
        setSelectedContextId(context.id);
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

export default withContexts(ContextManager);