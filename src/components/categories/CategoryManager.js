import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import ContactManager from '../contacts/ContactManager';
import ContextManager from '../contexts/ContextManager';
import FolderManager from '../folders/FolderManager';
import GoalManager from '../goals/GoalManager';
import LocationManager from '../locations/LocationManager';
import TagManager from '../tags/TagManager';

function CategoryManager(props) {
    const category = props.category;
    const objectId = props.objectId;

    const onActiveKeyChange = activeKey => {
        props.onCategorySelection(activeKey);
    };

    const onObjectSelection = objectId => {
        props.onObjectSelection(objectId);
    };

    return (
        <Tabs activeKey={category} onChange={onActiveKeyChange} animated={false}>
            <Tabs.TabPane tab="Contacts" key="contacts">
                <ContactManager contactId={category === 'contacts' ? objectId : null} onContactSelection={onObjectSelection} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contexts" key="contexts">
                <ContextManager contextId={category === 'contexts' ? objectId : null} onContextSelection={onObjectSelection} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Folders" key="folders">
                <FolderManager folderId={category === 'folders' ? objectId : null} onFolderSelection={onObjectSelection} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Goals" key="goals">
                <GoalManager goalId={category === 'goals' ? objectId : null} onGoalSelection={onObjectSelection} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Locations" key="locations">
                <LocationManager locationId={category === 'locations' ? objectId : null} onLocationSelection={onObjectSelection} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Tags" key="tags">
                <TagManager tagId={category === 'tags' ? objectId : null} onTagSelection={onObjectSelection} />
            </Tabs.TabPane>
        </Tabs>
    );
}

CategoryManager.propTypes = {
    category: PropTypes.string.isRequired,
    objectId: PropTypes.string,
    onCategorySelection: PropTypes.func.isRequired,
    onObjectSelection: PropTypes.func.isRequired
};

export default CategoryManager;