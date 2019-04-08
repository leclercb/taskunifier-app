import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, Popconfirm } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';

function ContextList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.contexts}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onContextSelection(item)}
                        className={item.id === props.selectedContextId ? 'selected-list-item' : null}>
                        <LeftRight right={(
                            <Popconfirm
                                title={`Do you really want to delete "${item.title}" ?`}
                                onConfirm={() => props.deleteContext(item.id)}
                                okText="Yes"
                                cancelText="No">
                                <Icon
                                    icon="trash-alt"
                                    color="#e3f2eb"
                                    className="object-actions" />
                            </Popconfirm>
                        )}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addContext()} style={{ marginTop: 5 }}><Icon icon="plus" text="Add" /></Button>
        </React.Fragment>
    );
}

ContextList.propTypes = {
    contexts: PropTypes.array.isRequired,
    selectedContextId: PropTypes.string,
    addContext: PropTypes.func.isRequired,
    deleteContext: PropTypes.func.isRequired,
    onContextSelection: PropTypes.func.isRequired
}

export default ContextList;