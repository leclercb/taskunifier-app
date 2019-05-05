import { connect } from 'react-redux';
import withBusyCheck from 'containers/WithBusyCheck';

function withNote(Component, propertyId = 'noteId') {
    const mapStateToProps = (state, ownProps) => ({
        note: state.notes.filteredByVisibleState.find(note => note.id === ownProps[propertyId])
    });

    const mapDispatchToProps = () => ({

    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withBusyCheck(Component));
}

export default withNote;