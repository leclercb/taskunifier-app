import { connect } from 'react-redux';
import { isBusy } from 'selectors/ProcessSelectors';

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