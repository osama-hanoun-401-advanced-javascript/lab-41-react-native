import React, {useState, useEffect} from 'react';
import { StyleSheet, FlatList, Text, View, Button, Linking,TextInput,Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
const { WebClient } = require('@slack/web-api');
function App(props) {

  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState();
  const [channels,setChannels] =useState([]);
  const [activeChannel, setActiveChannel] = useState(false);
  const [breakTime,setBreakTime] = useState();
  const [zoomUrl,setZoomUrl] = useState('');
  const [massage,setMassage] = useState('');
 const getChannels = async()=>{
   const web = new WebClient(token);
   const result = await web.conversations.list();
   setChannels(result.channels)
 }
const _StartBreak =  () => {
  setMassage('Break for ' +breakTime + 'minutes');
   const web = new WebClient(token);
    let result =  web.chat.postMessage({
    text: `@channel Break for ${breakTime} minutes`,
    channel: activeChannel.id,
    link_names:1
  });

  setTimeout(async() =>{
     result = await web.chat.postMessage({
    text: `@channel Back to Class \n Zoom Link: ${zoomUrl}`,
    channel: activeChannel.id,
    link_names:1
  });
  setMassage('Back to class!!');
   }, Number(breakTime)*60000);
}
const _handleSlectedChannel = (channelObj)=> {
  setActiveChannel(channelObj);
setChannels([]);
}
  return (
    <View style={styles.container}>

    <TextInput
      style={{ width:200,height: 40, borderColor: 'gray', borderWidth: 2}}
      onChangeText={text => setToken(text)}
      placeholder={"Your Token"}
    />
    <Button onPress={() => getChannels()}   title="Get channels" >
    </Button>
      <TextInput
      style={{ width:200,height: 40, borderColor: 'gray', borderWidth: 2}}
      onChangeText={text => setZoomUrl(text)}
      placeholder={"Zoom Url"}
    />      

     {channels.length >0? <View style={styles.section}>
        <Text>Pick a Channel</Text>
        <FlatList
          data={channels}
          keyExtractor={(item)=>item.id}
          renderItem={({item})=><Button style={styles.person} title={item.name} onPress={()=>_handleSlectedChannel({id:item.id,name:item.name})}/>}
        />
      </View> : null}
      {activeChannel? <View style={styles.section}>
  <TextInput
      style={{ width:200,height: 40, borderColor: 'gray', borderWidth: 2}}
      onChangeText={text => setBreakTime(text)}
      placeholder={"Time in Minutes"}
    />      
    <Button onPress={() => _StartBreak()}   title="Start Break" > </Button>
    <Text>{massage}</Text>
      </View> : null}
    </View>
  );

}

const styles = StyleSheet.create({
  person: {
    marginTop:'1em',
  },
  section: {
    margin: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    marginTop: 25,
  },
});

export default App;