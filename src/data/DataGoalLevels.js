export function getGoalLevel(goalLevelId) {
    return getGoalLevels().find(goalLevel => goalLevel.id === goalLevelId);
}

export function getGoalLevelIndex(goalLevelId) {
    return getGoalLevels().findIndex(goalLevel => goalLevel.id === goalLevelId) || 0;
}

export function getGoalLevels() {
    return [
        {
            id: 'shortTerm',
            title: 'Short Term',
            color: '#d1e1ff'
        },
        {
            id: 'longTerm',
            title: 'Long Term',
            color: '#71b6f2'
        },
        {
            id: 'lifeTime',
            title: 'Life Time',
            color: '#0459f7'
        }
    ];
}