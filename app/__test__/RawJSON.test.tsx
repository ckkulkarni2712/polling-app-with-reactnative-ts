import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { shallow } from 'enzyme';
import RawJSON from '../RawJSON';
import Adapter from 'enzyme-adapter-react-16';
import * as enzyme from 'enzyme';

enzyme.configure({ adapter: new Adapter() });


describe('RawJSON component', () => {
  let wrapper:any;
  beforeEach(() => {
    wrapper = shallow(<RawJSON route={{ params: { post: 'test post' } }} />);
  });

  it('should render a View component', () => {
    expect(wrapper.find(View)).toHaveLength(1);
  });

  it('should render a ScrollView component', () => {
    expect(wrapper.find(ScrollView)).toHaveLength(1);
  });

  it('should render a Text component', () => {
    expect(wrapper.find(Text)).toHaveLength(1);
  });

  it('should display the post as a stringified JSON object', () => {
    const text = wrapper.find(Text).first();
    expect(text.contains(JSON.stringify({ post: 'test post' }, null, 2))).toBeTruthy();
  });
});