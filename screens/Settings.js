import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, List, ListItem } from 'react-native';

import { USERID, IMGPATH } from '../config/config'

class Settings extends Component {
  render() {
    return (
	  <View>
	  <View style={styles.header}>
	    <TouchableOpacity
          onPress={() => {this.props.navigation.navigate('DrawerOpen'); } }
          style={styles.button}
        >
        <Image source={{ uri: IMGPATH+'menuicon.png' }} style={ styles.menu } />
        </TouchableOpacity>

	  	<Image source={{ uri: IMGPATH+'logonew.png' }} style={ styles.logo } />
	  	<Image source={{ uri: IMGPATH+'personalnew.png' }} style={ styles.personal } />
	  </View>


      <ScrollView>
        <List>
          <ListItem
            title="Notifications111"
          />
          <ListItem
            title="Profile"
          />
          <ListItem
            title="Password"
          />
        </List>
        <List>
          <ListItem
            title="Sign Out"
            rightIcon={{ name: 'cancel' }}
          />
        </List>
      </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
	header: {
		height: 80,
		marginTop: 20,
		backgroundColor: '#000',
       flexDirection:'row',
       justifyContent: 'space-between'
	},
	logo: {
		height: 60,
		width: 120,
		margin: 10
	},
	menu: {
		 height:30,
		 width: 30,
		 margin:25
	},
	personal: {
		height:30,
		width: 30,
		margin:25
	},


});

export default Settings;
