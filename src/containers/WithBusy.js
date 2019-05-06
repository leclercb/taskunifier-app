import { connect } from 'react-redux';

function withBusy(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy
    });

    return connect(
        mapStateToProps,
        null
    )(Component);
}

export default withBusy;