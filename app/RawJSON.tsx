import React from 'react';
import { View, Text, ScrollView } from 'react-native';

function RawJSON({ route }: any) {
    const post = route.params;
    //console.log(post);
    return (
        <View>
            <ScrollView>
               <Text>{JSON.stringify(post, null, 2)}</Text>
                
           </ScrollView>
           
        </View>
    );
}

export default RawJSON;