import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';

function NoteFilterList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.noteFilters}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onNoteFilterSelection(item)}
                        className={item.id === props.selectedNoteFilterId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addNoteFilter(item), () => props.deleteNoteFilter(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addNoteFilter()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

NoteFilterList.propTypes = {
    noteFilters: PropTypes.array.isRequired,
    selectedNoteFilterId: PropTypes.string,
    addNoteFilter: PropTypes.func.isRequired,
    deleteNoteFilter: PropTypes.func.isRequired,
    onNoteFilterSelection: PropTypes.func.isRequired
};

export default NoteFilterList;