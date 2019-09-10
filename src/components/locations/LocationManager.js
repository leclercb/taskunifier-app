import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import withLocations from 'containers/WithLocations';
import LocationList from 'components/locations/LocationList';
import LocationForm from 'components/locations/LocationForm';
import { LocationPropType } from 'proptypes/LocationPropTypes';

function LocationManager(props) {
    const selectedLocationId = props.locationId;

    const onAddLocation = async location => {
        location = await props.addLocation(location);
        props.onLocationSelection(location.id);
    };

    const onDuplicateLocation = async location => {
        location = await props.duplicateLocation(location);
        props.onLocationSelection(location.id);
    };

    const onLocationSelection = location => {
        props.onLocationSelection(location.id);
    };

    const selectedLocation = props.locations.find(location => location.id === selectedLocationId);

    return (
        <Row>
            <Col span={6}>
                <LocationList
                    locations={props.locations}
                    selectedLocationId={selectedLocationId}
                    addLocation={onAddLocation}
                    duplicateLocation={onDuplicateLocation}
                    deleteLocation={props.deleteLocation}
                    onLocationSelection={onLocationSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedLocation ? (
                    <LocationForm key={selectedLocationId} location={selectedLocation} updateLocation={props.updateLocation} />
                ) : <Empty description="Please select a location" />}
            </Col>
        </Row>
    );
}

LocationManager.propTypes = {
    locationId: PropTypes.string,
    locations: PropTypes.arrayOf(LocationPropType.isRequired).isRequired,
    onLocationSelection: PropTypes.func.isRequired,
    addLocation: PropTypes.func.isRequired,
    duplicateLocation: PropTypes.func.isRequired,
    updateLocation: PropTypes.func.isRequired,
    deleteLocation: PropTypes.func.isRequired
};

export default withLocations(LocationManager);