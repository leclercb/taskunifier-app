import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { createActions } from 'utils/CategoryListUtils';
import { getColorFromIndex } from 'utils/ColorUtils';

function FieldList(props) {
    const onAddField = () => {
        props.addField({
            color: getColorFromIndex(props.fields.length),
            type: 'text',
            editable: true
        });
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.fields.filter(field => !field.static)}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onFieldSelection(item)}
                        className={item.id === props.selectedFieldId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateField(item), () => props.deleteField(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => onAddField()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

FieldList.propTypes = {
    fields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired,
    selectedFieldId: PropTypes.string,
    addField: PropTypes.func.isRequired,
    duplicateField: PropTypes.func.isRequired,
    deleteField: PropTypes.func.isRequired,
    onFieldSelection: PropTypes.func.isRequired
};

export default FieldList;