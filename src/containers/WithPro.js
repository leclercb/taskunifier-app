import React from 'react';
import { connect } from 'react-redux';
import { isValidLicense } from '../utils/LicenseUtils';

function withPro(Component) {
    function WithPro(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.license)
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithPro);
}

export default withPro;