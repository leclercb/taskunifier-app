import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import Icon from '../common/Icon';
import LeftRight from '../common/LeftRight';
import { createActions } from '../../utils/CategoryListUtils';

function TagList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.tags}
                style={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onTagSelection(item)}
                        className={item.id === props.selectedTagId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.addTag(item), () => props.deleteTag(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
        </React.Fragment>
    );
}

TagList.propTypes = {
    tags: PropTypes.array.isRequired,
    selectedTagId: PropTypes.string,
    deleteTag: PropTypes.func.isRequired,
    onTagSelection: PropTypes.func.isRequired
};

export default TagList;