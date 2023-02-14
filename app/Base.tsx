import { StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import React, {useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { Table, Row, Col } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Base = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  interface Post {
    url: string;
    title: string;
    created_at: string;
    author: string;
    objectID: string;
  }
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentpage, setPage] = useState(0);
  const [fetched, setFetched] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentPageRef = useRef(currentpage);
  let delayTime: any;
  const cache = 3600 * 1000;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('postsCache')
      .then(data => {
        if (data) {
          const postsCache = JSON.parse(data);
          const currentTime = new Date().getTime();
          if (currentTime - postsCache.timestamp < cache) {
            setPosts(postsCache.posts);
          } else {
            getData(currentpage);
          }
        } else {
          getData(currentpage);
        }
      });
  }, []);

  useEffect(() => {
    if (!loading && hasMore) {
      getData(currentpage);
    }
  }, [currentpage,loading])
   
  useEffect(() => {
    delayTime = setTimeout(() => {
      if (!loading) {
        currentPageRef.current += 1;
        setPage(currentPageRef.current);
     }
    }, 10000);

    return () => clearTimeout(delayTime);
  }, [currentpage, loading]);

  const getData = async (currentpage: number) => {
    setLoading(true);
    const resultSet = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${currentpage}&hitsPerPage=3`);
    if (resultSet.data.hits.length > 0) {
      setPosts([...posts, ...resultSet.data.hits]);
      setPage(currentpage + 1);
    } else {
      setHasMore(false);
    }
    
    setFetched(currentpage);
    AsyncStorage.setItem('postsCache', JSON.stringify({
      timestamp: new Date().getTime(),
      posts: [...posts, ...resultSet.data.hits],
    }));


    setLoading(false);
  };

  const tableHead = ['URL', 'Title', 'Created at', 'Author'];

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 50;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
    <ScrollView style={styles.container}  onScroll={({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        if (!loading && hasMore) {
          if (fetched !== currentpage) {
            getData(currentpage);
          }
        }
      }
    }}>
      <Table style={styles.table}>
        <Row data={tableHead} style={styles.header} textStyle={{
          fontWeight: 'bold',
          fontSize: 18,
          textAlign: 'center',
          color: 'black',
        }} />

        {posts.map((post,index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Raw JSON', { item: post })}
            style={styles.row}
          >
            <Col data={[post.url]} textStyle={{ fontSize: 16,textAlign: 'center',color: 'black', }} style={styles.cell } />
            <Col data={[post.title]} textStyle={{ fontSize: 16,textAlign: 'center',color: 'black',  }} style={styles.cell }/>
            <Col data={[post.created_at]} textStyle={{ fontSize: 16,textAlign: 'center',color: 'black',  }} style={styles.cell }/>
            <Col data={[post.author]} textStyle={{ fontSize: 16,textAlign: 'center',color: 'black',  }} style={styles.cell }/>
          </TouchableOpacity>
        ))}
      </Table>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  table: {
    marginBottom: 10,
  },
  cell: {
    borderWidth: 1,
  },
  header: {
    backgroundColor: 'lightgray',
    height: 50,
    borderWidth: 1,
    borderLeftWidth: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
    row: {
      flex: 1,
      flexDirection: 'row',
  }
});
export default Base;
