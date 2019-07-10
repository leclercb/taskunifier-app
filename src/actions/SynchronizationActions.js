import { synchronizeWithToodledo } from 'actions/toodledo/ToodledoSynchronizationActions';

export function synchronize() {
    return synchronizeWithToodledo();
}