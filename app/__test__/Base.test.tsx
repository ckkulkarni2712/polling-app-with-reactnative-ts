import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import axios from 'axios';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Base from '../Base';
jest.mock('axios');
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});
const navigation = useNavigation<NativeStackNavigationProp<any>>();
describe('Base component', () => {
  it('should render a list of posts', async () => {
    const post = {
      url: 'https://example.com',
      title: 'Example title',
      created_at: '13-02-2023',
      author: 'John Doe',
      objectID: '001',
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        hits: [post],
      },
    });

    const { findByText, findAllByText } = render(<Base />);

    const url = await findByText(post.url);
    expect(url).toBeTruthy();

    const title = await findByText(post.title);
    expect(title).toBeTruthy();

    const createdAt = await findByText(post.created_at);
    expect(createdAt).toBeTruthy();

    const author = await findByText(post.author);
    expect(author).toBeTruthy();

    const touchableOpacity = await findAllByText(post.title);
    fireEvent.press(touchableOpacity[0]);
    expect(navigation.navigate).toHaveBeenCalledWith('Raw JSON', { item: post });
  });
});
