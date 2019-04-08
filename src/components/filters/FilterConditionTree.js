import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import uuid from 'nes-core-frontend/lib/utils/Uuid';
import ConditionTree from '../../../generic/conditiontree/ConditionTree';
import AircraftCodeCondition from './AircraftCodeCondition';

function FilterConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        switch (key) {
            case 'AircraftCodeCondition':
                return {
                    '@uuid': uuid(),
                    '@class': '***REMOVED***.nconect.airspace.em.rs.trees.AircraftCodeCondition'
                };
            default:
                throw new Error('Unknown condition type "' + key + '"');
        }
    }

    const getLeafComponent = condition => {
        switch (condition['@class']) {
            case '***REMOVED***.nconect.airspace.em.rs.trees.AircraftCodeCondition':
                return AircraftCodeCondition;
            default:
                throw new Error('Unknown condition type "' + condition['@class'] + '"');
        }
    }

    return (
        <ConditionTree
            disabled={props.disabled}
            condition={props.condition}
            context={props.context}
            createLeafObject={createLeafObject}
            addMenuItems={[
                <Menu.SubMenu key="aicraft_equipment_conditions" title='Aircraft Equipment'>
                    <Menu.Item key="ComNavCondition">
                        ComNav (Field 10a)
                    </Menu.Item>
                    <Menu.Item key="PbnCondition">
                        PBN (Field 18)
                    </Menu.Item>
                    <Menu.Item key="SurCondition">
                        Surveillance (Field 10b)
                    </Menu.Item>
                </Menu.SubMenu>
            ]}
            getLeafComponent={getLeafComponent} />
    );
}

FilterConditionTree.propTypes = {
    condition: PropTypes.object,
    context: PropTypes.object,
    disabled: PropTypes.bool.isRequired
};

export default FilterConditionTree;
