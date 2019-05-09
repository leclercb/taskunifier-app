import { connect } from 'react-redux';
import { isBusy } from 'selectors/ThreadSelectors';

function withBusy(Component) {
    const mapStateToProps = state => ({
        busy: isBusy(state)
    });

    return connect(
        mapStateToProps,
        null
    )(Component);
}

export default withBusy;