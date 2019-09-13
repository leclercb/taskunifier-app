import React from 'react';
import PropTypes from 'prop-types';
import { Col, Empty, Row } from 'antd';
import LocationList from 'components/locations/LocationList';
import LocationForm from 'components/locations/LocationForm';
import { useLocationApi } from 'hooks/UseLocationApi';

function LocationManager(props) {
    const locationApi = useLocationApi();
    const selectedLocationId = props.locationId;

    const onAddLocation = async location => {
        location = await locationApi.addLocation(location);
        props.onLocationSelection(location.id);
    };

    const onDuplicateLocation = async location => {
        location = await locationApi.duplicateLocation(location);
        props.onLocationSelection(location.id);
    };

    const onLocationSelection = location => {
        props.onLocationSelection(location.id);
    };

    const selectedLocation = locationApi.locations.find(location => location.id === selectedLocationId);

    return (
        <Row>
            <Col span={6}>
                <LocationList
                    locations={locationApi.locations}
                    selectedLocationId={selectedLocationId}
                    addLocation={onAddLocation}
                    duplicateLocation={onDuplicateLocation}
                    deleteLocation={locationApi.deleteLocation}
                    onLocationSelection={onLocationSelection} />
            </Col>
            <Col span={2} />
            <Col span={16}>
                {selectedLocation ? (
                    <LocationForm key={selectedLocationId} location={selectedLocation} updateLocation={locationApi.updateLocation} />
                ) : <Empty description="Please select a location" />}
            </Col>
        </Row>
    );
}

LocationManager.propTypes = {
    locationId: PropTypes.string,
    onLocationSelection: PropTypes.func.isRequired
};

export default LocationManager;