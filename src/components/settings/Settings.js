import React from 'react';
import PropTypes from 'prop-types';
import withSettings from '../../containers/WithSettings';

function Settings(props) {
    const settings = props.settings.data;

    let categories = Object.keys(settings).map(key => settings[key].category);
    categories = Array.from(new Set(categories));

    return categories.map(category =>
        <React.Fragment>
            <span>{category}</span>
            {Object.keys(settings).filter(key => settings[key].visible).map(key => {
                const setting = settings[key];
                return <div key={key}>{`${setting.title} : ${setting.value}`}</div>
            })}
        </React.Fragment>
    );
}

Settings.propTypes = {
    settings: PropTypes.object.isRequired
}

export default withSettings(Settings);