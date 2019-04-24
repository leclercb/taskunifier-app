import { connect } from 'react-redux';

function withBusy(Component) {
    const mapStateToProps = state => ({
        busy: state.processes.busy
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(Component);
}

export default withBusy;