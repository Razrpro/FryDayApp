import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, StatusBar, Text, AsyncStorage, ActivityIndicator, List, ListItem  } from 'react-native';

import call from 'react-native-phone-call'
import MapView from 'react-native-maps';

import { USERID, IMGPATH } from '../config/config'

class Contacts extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
		    adress: '',
		    phone: '',
		    uptime: '',
		    latitude: 0,
			longitude: 0,
			latitudeDelta: 55.894095,
			longitudeDelta: 37.449743,
			isLoadingKorzina: true,
		    kolvotovar: 0,
		    summtovar: 0,

	    };

  	}

  	componentDidMount() {

  				fetch('https://appcafe.ru/api2.php?do=getContacts&userid='+USERID)
					.then((response) => response.json())
					.then((responseJson) => {

					    if(responseJson[0]=="error"){
					     		alert('Ошибка загрузки контактов, попробуйте еще раз!');
					    }

						else{
							   this.setState({

								   	adress:responseJson[0].adress,
									phone:responseJson[0].phone,
									uptime:responseJson[0].uptime,
									latitude:parseFloat(responseJson[0].lat),
									longitude:parseFloat(responseJson[0].lang),


							   });
						}

					})
					.catch((error) => {
					       console.error(error);
					});

		 AsyncStorage.getItem('Tovar',(err, result) => {
				console.log('ASYNC LOAD!'+result);
				var tArr = JSON.parse(result);

				var temp_summ = 0;
				var temp_kolvo = 0;

				if(tArr!=null){
					var data2 = tArr.map(function(value, index) {
				    	temp_summ = temp_summ + value[0].price*value[0].kolvo;
				    	temp_kolvo = temp_kolvo + value[0].kolvo;
					});
				}
				else{
            this.setState({
  						kolvotovar: 0,
  						summtovar: 0,
  						isLoadingKorzina: false,
            });
        }

				//if(this.state.kolvotovar != temp_kolvo || this.state.summtovar != temp_summ){
						console.log('TEMP_KOLVO:'+temp_kolvo);

					this.setState({
						kolvotovar: temp_kolvo,
						summtovar: temp_summ,
						isLoadingKorzina: false,

		        	});

		     //   }
		 });

  	}

  render() {

	  if(this.state.isLoadingKorzina){
		 SHOPING_CART_TOP = <ActivityIndicator />

	 }
	 else{
		 if(this.state.kolvotovar>0 && this.state.summtovar>0)
		 {
			 //Если товары и сумма есть то выводим корзину с цифрами
		 	 SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox } onPress={() => { this.props.navigation.navigate('Cart');}}>

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

							  		<View style={styles.cartkolvo}><Text style={styles.cartkolvotext}>{this.state.kolvotovar}</Text></View>
							  		<Text style={styles.pricetop}>{this.state.summtovar}₽</Text>

						  	    </TouchableOpacity>;
		}
		else{
			SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox } onPress={() => { this.props.navigation.navigate('Cart');}}>

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

						  	    </TouchableOpacity>;

		}
	 }

    return (
	  <View style={styles.black}>
	  <StatusBar barStyle="light-content"/>
	  <View style={styles.header}>
	    <TouchableOpacity
          onPress={() => {this.props.navigation.navigate('DrawerOpen'); } }
          style={styles.button}
        >
        <Image source={{ uri: IMGPATH+'menuicon.png' }} style={ styles.menu } />
        </TouchableOpacity>

	  	<Image source={{ uri: IMGPATH+USERID+'/logonew.png' }} style={ styles.logo } />
	  	{SHOPING_CART_TOP}
	  </View>
	  <View style={styles.container}>
	  		<Text style={styles.titletext}>Контакты ресторана</Text>
	  		<View style={styles.textmainboxleftalign}>
		  		<TouchableOpacity
		  		onPress={() => { call( {number: this.state.phone, prompt: false} ); } }
		  		style={styles.textmainbox}>
		  			<Image source={{ uri: IMGPATH+'phonepic.png' }} style={ styles.picimg } />
		  			<Text style={styles.textmain}>
		  				<Text style={styles.textbold}>Телефон:</Text> {this.state.phone}
		  			</Text>

		  		</TouchableOpacity>

		  		<View style={styles.textmainbox}><Image source={{ uri: IMGPATH+'timepic.png' }} style={ styles.picimg } /><Text style={styles.textmain}><Text style={styles.textbold}>Часы работы:</Text> {this.state.uptime}</Text></View>
		  		<View style={styles.textmainbox}><Image source={{ uri: IMGPATH+'locpic.png' }} style={ styles.picimg2 } /><Text style={styles.textmain}><Text style={styles.textbold}>Адрес:</Text> {this.state.adress}</Text></View>
		  	</View>
	  </View>
	  <View style={styles.containermap}>

	 	  <MapView
	 	 	style={styles.map}
		    region={{
		      latitude: this.state.latitude,
		      longitude: this.state.longitude,
		      latitudeDelta: 0.0922,
		      longitudeDelta: 0.0421,
		    }}
		  >

	            <MapView.Marker

	              coordinate={{latitude: this.state.latitude,longitude: this.state.longitude}}

	              title={this.state.adress}
	            />

		  </MapView>

      </View>
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
       justifyContent: 'space-between',
	},
	logo: {
		height: 50,
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
		width: 35,
		marginTop:23,

	},
	personalbox: {
		height:55,
		width: 65,
	},
	container: {
	  backgroundColor: '#000',
	  paddingTop: 10,
	  paddingBottom: 20,
	  alignItems: 'center',
	},
	black: {
	  flex: 1,
	  backgroundColor: '#000',

	},
	titletext: {
		fontSize: 22,
		color: '#fff9ee',
		paddingBottom: 20,
  	},
  	textmainboxleftalign: {
	  	alignItems: 'flex-start',
  	},
  	textmainbox: {
	  	width: 250,
	  	paddingTop: 10,
	  	paddingBottom: 10,
	  	flexDirection:'row',
  	},
  	textmain: {
	  	fontSize: 16,
		color: '#fff9ee',
		fontWeight: '100'
  	},
  	picimg: {
	  	width: 20,
	  	height: 20,
	  	marginRight:5,
  	},
  	picimg2: {
	  	width: 20,
	  	height: 30,
	  	marginRight:5,
  	},
  	textbold: {
	  	fontWeight: '600',
  	},
  	containermap: {
	  flex: 1,
	},
	map: {
    ...StyleSheet.absoluteFillObject,
	},
	cartkolvo: {
		width:20,
		height:20,
		backgroundColor: '#ff7800',
		borderRadius: 40,
		borderWidth: 0.7,
		borderColor: '#ff7800',
		alignItems: 'center',
		position: 'absolute',
		left: 25,
		top: 15,
	},
	cartkolvotext: {
			color: '#ffffff',
	},
});

export default Contacts;
