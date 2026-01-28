import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
export default function Forgotpassword({navigation}:any) {
    const [username, setUsername] =useState('');
    const [forgotpassword, setForgotpassword] =useState('');
    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.head}>Forgot Password</Text>
                <Text style={styles.text}>Username</Text>
                <TextInput placeholder="Enter your username" style={styles.placeholder} value={username}
  onChangeText={(text) => setUsername(text)}></TextInput>
                <Text style={styles.text}>New Password</Text>
                <TextInput placeholder="Enter new password" secureTextEntry={true} style={styles.placeholder} value={forgotpassword}
  onChangeText={(text) => setForgotpassword(text)}></TextInput>
              <Pressable
  style={styles.submit}
  onPress={() => {
    navigation.navigate('Login') 
  }}
>
  <Text style={styles.texts}>Submit</Text>
</Pressable>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({

   container: {
    flex: 1, // fill the entire screen
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
    form:{
        height:400,
        width:300,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:2,
        borderRadius:10,
        borderColor:'#FF0000',
        backgroundColor:'#FFFFFF',
    },
    head:{
        fontStyle:'italic',
        fontSize:30,
        fontWeight:'bold',
        color:'#FF0000',
    },
    text:{
        fontStyle:'italic',
        color:'#FF0000',
        fontSize:20,
        alignSelf:'flex-start',
        marginLeft:20,
        marginTop:10,
    },
    placeholder:{
        fontStyle:'italic',
        color:'#FF0000',
        height:40,
        width:200,
        borderWidth:1,
        borderRadius:5,
        borderColor:'#FF0000',
        marginTop:5,
        paddingLeft:10,
    },
    submit:{
        backgroundColor:'#FF0000',
        color:'#FFFFFF',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        height:40,
        width:200,
        borderRadius:20,
        boxShadow: '0 4px 8px '+ '#FF0000',
    
    },
    texts:{
        fontStyle:'italic',
        color:'#FFFFFF',
        fontSize:20,
        fontWeight:'bold',
    },
});