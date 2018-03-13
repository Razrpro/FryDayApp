import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, StatusBar, Text, Dimensions, ActivityIndicator, AsyncStorage, List, ListItem } from 'react-native';

import ImageSlider from 'react-native-image-slider';

import { USERID, IMGPATH, IMGBIGMASS, ABOUTTEXT } from '../config/config'



class About extends Component {

	constructor(props) {
	    super(props);



	    this.state = {
		    isLoadingKorzina: true,
		    kolvotovar: 0,
		    summtovar: 0,
	    }

	}

	componentDidMount() {

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

		       // }
		 });
	}


  render() {

	  if(this.state.isLoadingKorzina){
		 SHOPING_CART_TOP = <ActivityIndicator  style={ styles.personalbox }/>

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
	  	{ SHOPING_CART_TOP }
	  </View>
	  <ScrollView>
		  <View style={styles.container}>
		  		<Text style={styles.titletext}>О ресторане</Text>
		  		<View style={styles.textmainboxleftalign}>
		  		<Text style={styles.textmain}>
		  			{ABOUTTEXT}
				</Text>
			  	</View>
		  </View>



				<ImageSlider height={300} style={styles.imagebig} images={IMGBIGMASS} />

   		</ScrollView>

     </View>

    );
  }
}


const win = Dimensions.get('window');

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
		margin: 15
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
		fontWeight: '100',
		paddingLeft: 30,
		paddingRight: 30,
  	},

  	imagebig: {
	    flex: 1,
        alignSelf: 'baseline',
        width: win.width,
        height: 300,
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
		pricetop: {
			color: '#fff9ee',
			fontSize: 14,
		},
});

export default About;
