import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withTags from 'containers/WithTags';
import TagList from 'components/tags/TagList';
import TagForm from 'components/tags/TagForm';
import { TagPropType } from 'proptypes/TagPropTypes';

function TagManager(props) {
    const selectedTagId = props.tagId;

    const updateTag = tag => {
        props.updateTag(tag).then(() => {
            props.onTagSelection(tag.title);
        });
    };

    const onTagSelection = tag => {
        props.onTagSelection(tag.id);
    };

    const selectedTag = props.tags.find(tag => tag.id === selectedTagId);

    return (
        <Row>
            <Col span={6}>
                <TagList
                    tags={props.tags}
                    selectedTagId={selectedTagId}
                    deleteTag={props.deleteTag}
                    onTagSelection={onTagSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedTag ? (
                    <TagForm key={selectedTagId} tag={selectedTag} updateTag={updateTag} />
                ) : <Empty description="Please select a tag" />}
            </Col>
        </Row>
    );
}

TagManager.propTypes = {
    tagId: PropTypes.string,
    tags: PropTypes.arrayOf(TagPropType.isRequired).isRequired,
    onTagSelection: PropTypes.func.isRequired,
    updateTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired
};

export default withTags(TagManager, { getId: null });