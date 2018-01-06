import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ImageBackground, View, TouchableOpacity, Text, Dimensions, AsyncStorage, ActivityIndicator, Animated, Vibration, Tile, List, ListItem } from 'react-native';
import { USERID, IMGPATH } from '../config/config'



class UserDetail extends Component {

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



			//	if(this.state.kolvotovar != temp_kolvo || this.state.summtovar != temp_summ){
						console.log('TEMP_KOLVO:'+temp_kolvo);

					this.setState({
						kolvotovar: temp_kolvo,
						summtovar: temp_summ,
						isLoadingKorzina: false,

		        	});

		    //    }
		 });		}

	constructor(props) {
    super(props);

    this.state = {
      isLoadingKorzina: true,
      kolvotovar: 0,
      summtovar: 0,
      addTovar: false,
      action_name: 'Добавлено в корзину!',
    }
  }

  render() {
    const { id, name, sostav, opis, imgmini, imgbig, price } = this.props.navigation.state.params;


	//var StackTovar = array();
	var CurrTovar = [{id: id, name: name,  sostav: sostav, opis: opis, imgmini: imgmini, imgbig: imgbig, price: price, kolvo: 1}];

	if(this.state.addTovar){

		AddTovar = <View style={styles.addedTovar}>

					 	<Text style={styles.names}>
						      {this.state.action_name}
						</Text>

					 </View>;


					 var timer = setInterval(() => {
						 console.log('Timer!');

						  clearInterval(timer);
						  this.setState({
						  		addTovar: false,
						  });



						 }, 3000);




	 }
	 else{
		  AddTovar = <View />;
	 }


	 if(this.state.isLoadingKorzina){
		 SHOPING_CART_TOP = <ActivityIndicator  style={ styles.personalbox }/>

	 }
	 else{
		 if(this.state.kolvotovar>0 && this.state.summtovar>0)
		 {
			 //Если товары и сумма есть то выводим корзину с цифрами
		 	 SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox } onPress={() => {clearInterval(timer); this.props.navigation.navigate('Cart');}}>

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

							  		<View style={styles.cartkolvo}><Text style={styles.cartkolvotext}>{this.state.kolvotovar}</Text></View>
							  		<Text style={styles.pricetop}>{this.state.summtovar}₽</Text>

						  	    </TouchableOpacity>;
		}
		else{
			SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox } onPress={() => {clearInterval(timer); this.props.navigation.navigate('Cart');}}>

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

						  	    </TouchableOpacity>;

		}
	 }


	//AsyncStorage.removeItem('Tovar');


    return (
	 <View style={ styles.downlist }>
	 {AddTovar}
	  <View style={styles.header}>
	    <TouchableOpacity
          onPress={() => {

	         clearInterval(timer);

	        this.props.navigation.state.params.ScreeF.setState({
				isLoading: false,
			});

	         this.props.navigation.goBack();
	      }}
          style={styles.button}
        >
        <Image source={{ uri: IMGPATH+'backiconew.png' }} style={ styles.menu } />
        </TouchableOpacity>

	  	<Image source={{ uri: IMGPATH+USERID+'/logonew.png' }} style={ styles.logo } />

	  	{SHOPING_CART_TOP}


	  </View>


      <ScrollView>
        <ImageBackground source={{ uri: IMGPATH+imgbig }} style={styles.imagebig}>
        	<Image source={{ uri: IMGPATH+'gradientnew.png' }} style={styles.imagebig} />
        </ImageBackground>
 		<View  style={styles.downbox}>
			<View  style={styles.opisbox}>
		        <Text style={styles.names}>
		          {name}
		        </Text>
		        <Text style={styles.opis}>
		          {opis}
		        </Text>
		        <Text style={styles.sostav}>
		          {sostav}
		        </Text>
			</View>
			<View  style={styles.pricebox}>

					<TouchableOpacity
			          onPress={() => {

				          AsyncStorage.getItem('Tovar',(err, result) => {
						  		var tArr = JSON.parse(result);
						  		if (result !== null) {
							  		//Если уже есть товары в корзине то добавляем еще один

							  		var tovarInArray = false;
							  		tArr.map(function(value, index) {

								  	//	console.log('if('+value[0].id+'=='+id+')');
							  			if(value[0].id==id){
								  			 tovarInArray = true;
								  		}

							  		});


							  		if(!tovarInArray){
								  		var cn = tArr.length;
								  		tArr[cn] = CurrTovar;

								  		AsyncStorage.setItem('Tovar',JSON.stringify(tArr));
								  		console.log('CurrTovar:'+price);

								  		this.setState({
											kolvotovar: this.state.kolvotovar+1,
											summtovar: this.state.summtovar+price,
											action_name: 'Добавлено в корзину!',
											addTovar: true,
							        	});
							        	Vibration.vibrate();
							  		}
							  		else{
								  		this.setState({
											action_name: 'Уже добавлено в корзину!',
											addTovar: true,
							        	});

							  		}

							  	}
							  	else{
								  	//Если товаров еще нет то пишем новый первым
								  	var CurArray = [];
								  	CurArray[0] = CurrTovar;
								  	AsyncStorage.setItem('Tovar',JSON.stringify(CurArray));
								  	this.setState({
											kolvotovar: 1,
											summtovar: price,
											action_name: 'Добавлено в корзину!',
											addTovar: true,
							        });
							        Vibration.vibrate();
							  	}


						  });




			          } }
			          style={styles.priceborder}
			        >
						<Text style={styles.price}>
				          {price} ₽
				        </Text>
				    </TouchableOpacity>

			</View>
		</View>
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
	imagebig: {
	    flex: 1,
        alignSelf: 'baseline',
        width: win.width,
        height: 300,

	},
	downlist: {
		flex: 1,
		backgroundColor: '#000'
	},

	downbox: {
		 flexDirection:'row',
	},
	opisbox: {
		flex: 2,
		paddingLeft: 30,
		paddingTop: 20
	},
	names: {
		color: '#fff9ee',
		fontSize: 20
	},
	opis: {
		color: '#fff9ee',
		fontSize: 14,
		paddingTop: 10
	},
	sostav: {
		color: '#f5f0de',
		fontSize: 12,
		paddingTop: 10
	},
	pricebox: {
		flex: 1,
		alignItems: 'center'
	},
	price: {
		color: '#fff9ee',
		fontSize: 18
	},
	pricetop: {
		color: '#fff9ee',
		fontSize: 14,
	},
	priceborder: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 5,
		marginTop: 20,
		paddingBottom: 5,
		alignItems: 'center',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fff9ee'
	},
	cartkolvo: {
		width:20,
		height:20,
		backgroundColor: '#ff7800',
		borderRadius: 40,
		borderWidth: 0.7,
		borderColor: '#ff7800',
		alignItems: 'center',
		justifyContent:'center',
		position: 'absolute',
		left: 25,
		top: 15,
	},
	cartkolvotext: {
		color: '#ffffff',
	},
	addedTovar:{

		backgroundColor: 'rgba(0,0,0,0.7)',
		width: win.width-40,
		marginLeft: 20,
		height:140,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.7)',
		position: 'absolute',
		zIndex:10,
		top: 150,
		alignItems: 'center',
		justifyContent:'center',

	},

});



export default UserDetail;
