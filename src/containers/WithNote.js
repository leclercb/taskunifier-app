import { connect } from 'react-redux';
import { filterObjects } from 'utils/CategoryUtils';
import withBusyCheck from 'containers/WithBusyCheck';

function withNote(Component, propertyId = 'noteId') {
    const mapStateToProps = (state, ownProps) => ({
        note: filterObjects(state.notes.all).find(note => note.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNote;