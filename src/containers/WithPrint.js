import { connect } from 'react-redux';
import { printNotes, printTasks } from 'actions/PrintActions';

function withPrint(Component) {
    const mapDispatchToProps = dispatch => ({
        printNotes: notes => dispatch(printNotes(notes)),
        printTasks: tasks => dispatch(printTasks(tasks))
    });

    return connect(null, mapDispatchToProps)(Component);
}

export default withPrint;