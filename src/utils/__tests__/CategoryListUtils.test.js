import React from 'react';
import { shallow } from 'enzyme';
import { createAction } from 'utils/CategoryListUtils';

describe('create action ', () => {
    test('"print"', () => {
        const onPrint = jest.fn();
        const component = shallow(<div>{createAction('print', 'Print', onPrint, '#00ffff')}</div>);
        expect(component).toMatchSnapshot();
    });
});