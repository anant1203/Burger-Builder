import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NaviagtionItem from './NavigationItem/NavigationItem'

configure({adapter:new Adapter()});

describe('<NavigationItems />', () => {
    it('should render two <NaviagtionItems /> elements if not authenticated', () => {
        const wrapper = shallow(<NavigationItems/>);
        expect(wrapper.find(NaviagtionItem)).toHaveLength(2);

    });
})