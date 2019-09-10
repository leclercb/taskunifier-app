import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';

function LocationList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.locations}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onLocationSelection(item)}
                        className={item.id === props.selectedLocationId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateLocation(item), () => props.deleteLocation(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addLocation()} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

LocationList.propTypes = {
    locations: PropTypes.array.isRequired,
    selectedLocationId: PropTypes.string,
    addLocation: PropTypes.func.isRequired,
    duplicateLocation: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired,
    onLocationSelection: PropTypes.func.isRequired
};

export default LocationList;