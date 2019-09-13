import React from 'react';
import { Col, Empty, Row } from 'antd';
import PropTypes from 'prop-types';
import TagList from 'components/tags/TagList';
import TagForm from 'components/tags/TagForm';
import { useTagApi } from 'hooks/UseTagApi';

function TagManager(props) {
    const tagApi = useTagApi();
    const selectedTagId = props.tagId;

    const updateTag = async tag => {
        await tagApi.updateTag(tag);
        props.onTagSelection(tag.title);
    };

    const onTagSelection = tag => {
        props.onTagSelection(tag.id);
    };

    const selectedTag = tagApi.tags.find(tag => tag.id === selectedTagId);

    return (
        <Row>
            <Col span={6}>
                <TagList
                    tags={tagApi.tags}
                    selectedTagId={selectedTagId}
                    deleteTag={tagApi.deleteTag}
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
    onTagSelection: PropTypes.func.isRequired
};

export default TagManager;