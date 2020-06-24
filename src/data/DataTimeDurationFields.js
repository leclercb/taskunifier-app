import { addColorsToArray } from 'utils/ColorUtils';

export function getTimeDurationFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'amount',
            title: 'Amount',
            type: 'number',
            editable: true
        },
        {
            static: true,
            id: 'unit',
            title: 'Unit',
            type: 'select',
            options: {
                values: [
                    {
                        title: 'Second(s)',
                        value: 'second'
                    },
                    {
                        title: 'Minute(s)',
                        value: 'minute'
                    },
                    {
                        title: 'Hour(s)',
                        value: 'hour'
                    },
                    {
                        title: 'Day(s)',
                        value: 'day'
                    },
                    {
                        title: 'Week(s)',
                        value: 'week'
                    },
                    {
                        title: 'Month(s)',
                        value: 'month'
                    },
                    {
                        title: 'Year(s)',
                        value: 'year'
                    }
                ]
            },
            editable: true
        }
    ]);
}