import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';

function ContextList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.contexts}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onContextSelection(item)}
                        className={item.id === props.selectedContextId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateContext(item), () => props.deleteContext(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addContext()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

ContextList.propTypes = {
    contexts: PropTypes.array.isRequired,
    selectedContextId: PropTypes.string,
    addContext: PropTypes.func.isRequired,
    duplicateContext: PropTypes.func.isRequired,
    deleteContext: PropTypes.func.isRequired,
    onContextSelection: PropTypes.func.isRequired
};

export default ContextList;