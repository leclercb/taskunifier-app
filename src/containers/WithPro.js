import React from 'react';
import { connect } from 'react-redux';

function withPro(Component) {
    function WithPro(props) {
        return <Component {...props} />
    }

    const mapStateToProps = state => ({
        pro: isValidLicense(state.settings.data.license)
    });

    const mapDispatchToProps = dispatch => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithPro);
}

export default withPro;