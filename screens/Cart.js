import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ListView,
  ActivityIndicator,
  TouchableOpacity,
  SideMenu,
  StatusBar,
  AsyncStorage,
  List,
  ListItem
} from 'react-native';

import DropdownMenu from '../src/DropdownMenu';
//import { users } from '../config/data';
import Swipeout from 'react-native-swipeout';

import { USERID, IMGPATH } from '../config/config'


 function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  throw new Error(response.statusText)
}

function json(response) {
  return response.json()
}

/*
	body: JSON.stringify({
    userid: 'Hubot',
    login: 'hubot',
  })*/
//console.log('https://appcafe.ru/api2.php?do=getMenuList&='+userid+'&tip=1');



class Cart extends Component {
  onLearnMore = () => {
    this.props.navigation.navigate('Oformlenie', { ScreeF: this });
  };



  componentDidMount() {

	}



  constructor(props) {
     super(props);

    // Bind the this context to the handler function
    this.updateKolvo = this.updateKolvo.bind(this);

    this.state = {
      kolvotovar: 0,
      summtovar: 0,
      isLoadingKorzina: true,
      isLoading: true,
    }

  }

  delete_row(id_to_delete){
	   console.log('DELETE:'+id_to_delete);

	   	var CurArray = [];


	  	AsyncStorage.getItem('Tovar').then(JSON.parse).then(items => {

          			var res_t_id=0;
          			var i = 0;

          			items.map(function(value, index) {
				    	t_id = items[index][0].id;

				    	if(t_id!=id_to_delete){

					    	var CurrTovar = [{id: items[index][0].id, name: items[index][0].name,  sostav: items[index][0].sostav, opis: items[index][0].opis, imgmini: items[index][0].imgmini, imgbig: items[index][0].imgbig, price: items[index][0].price, kolvo: items[index][0].kolvo}];
					    	CurArray[i]=CurrTovar
					    	i = i + 1;
				    	}

					});


		AsyncStorage.removeItem('Tovar');
		AsyncStorage.setItem('Tovar',JSON.stringify(CurArray));

		this.setState({
				isLoadingKorzina: true,
				isLoading: true,
		});

    })
   }

   updateKolvo(id, kolvo) {
  	console.log('id:'+id+' kolvo:'+kolvo);

  	var CurArray = [];

  		AsyncStorage.getItem('Tovar',(err, result) => {
			console.log('ASYNC LOAD2!'+result);
			CurArray = JSON.parse(result);
		});



  	AsyncStorage.getItem('Tovar').then(JSON.parse).then(items => {
          //this.setState({value: items});
          console.log('ITEMS: {'+items[0].id+'}');

          			var res_t_id=0;

          			items.map(function(value, index) {
				    	t_id = items[index][0].id;

				    	if(t_id==id){
					    	res_t_id = index;
				    	}
					});

          console.log('АПДЕЙТИМ: '+res_t_id);

		CurArray[res_t_id][0].kolvo = kolvo;
		AsyncStorage.removeItem('Tovar');
		AsyncStorage.setItem('Tovar',JSON.stringify(CurArray));

		this.setState({
				isLoadingKorzina: true,
		});

    })
  }



  render() {

	  if(this.state.isLoadingKorzina){

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

		    //    }
		 });
	 }
	 if(this.state.isLoading){
		  AsyncStorage.getItem('Tovar',(err, result) => {
			console.log('ASYNC LOAD2!'+result);
			var tArr = JSON.parse(result);

			console.log(tArr);
			this.setState({
				cartall: tArr,
				isLoading: false,
        	});

		});

	 }



			 //--------корзина в топе ----------------
	 if(this.state.isLoadingKorzina){
		 SHOPING_CART_TOP = <ActivityIndicator />

	 }
	 else{
		 console.log("k:"+this.state.kolvotovar+" s:"+this.state.summtovar);
		 if(this.state.kolvotovar>0 && this.state.summtovar>0)
		 {
			 //Если товары и сумма есть то выводим корзину с цифрами
		 	 SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox } >

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

							  		<View style={styles.cartkolvo}><Text style={styles.cartkolvotext}>{this.state.kolvotovar}</Text></View>
							  		<Text style={styles.pricetop}>{this.state.summtovar}₽</Text>

						  	    </TouchableOpacity>;
		}
		else{
			SHOPING_CART_TOP = <TouchableOpacity style={ styles.personalbox }>

							  		<Image source={{ uri: IMGPATH+'cartnew.png' }} style={ styles.personal } />

						  	    </TouchableOpacity>;

		}
	 }
	 //------//--корзина в топе -----------


	 if(this.state.isLoading){
	      activIND = <ActivityIndicator />;
	  }
      else{

	      var updateKolvo  =   this.updateKolvo;

        if(this.state.cartall != null && this.state.cartall.length)
        {
          activIND = <View style={styles.container}>
  		          {this.state.cartall.map((user) => (
  			        <Swipeout
  			        right={
  				        [{
  					      text: 'Удалить',
  					      backgroundColor: 'red',
  					      onPress: () => { this.delete_row(user[0].id) }
  					   	}]
  					 }
  				     backgroundColor='transparent'
  				     underlayColor='rgba(255, 0, 0, 1)'
  				     key={user[0].id}
  				     idrow={user[0].id}>

  			            <View style={styles.listItem}>



  			              <Image source={{ uri: IMGPATH+user[0].imgmini }} style={styles.imgmini} />



  			             <View style={styles.textbox}>
  			             	<Text style={styles.title}>{user[0].name}</Text>

  			             </View>

  						<View style={styles.dropdownmenu}>

  						  	<DropdownMenu
  						  //  arrowImg={{ uri: IMGPATH+'nextnew.png' }}      //set the arrow icon, default is a triangle
  					      //  checkImage={{ uri: IMGPATH+'nextnew.png' }}    //set the icon of the selected item, default is a check mark
  					          bgColor={"rgba(0,0,0,0)"}                            //the background color of the head, default is grey
  					          tintColor={"#fff9ee"}                          //the text color of the head, default is white
  					      //  selectItemColor={"red"}                    //the text color of the selected item, default is red
  					          data={[[ [{id:user[0].id, kolvo:1, razdelname:"1шт."}], [{id:user[0].id, kolvo:2, razdelname:"2шт."}], [{id:user[0].id, kolvo:3, razdelname:"3шт."}], [{id:user[0].id, kolvo:4, razdelname:"4шт."}], [{id:user[0].id, kolvo:5, razdelname:"5шт."}] , [{id:user[0].id, kolvo:6, razdelname:"6шт."}] , [{id:user[0].id, kolvo:7, razdelname:"7шт."}] , [{id:user[0].id, kolvo:8, razdelname:"8шт."}] , [{id:user[0].id, kolvo:9, razdelname:"9шт."}] , [{id:user[0].id, kolvo:10, razdelname:"10шт."}] ]]}


  					          maxHeight={130}                              // the max height of the menu
  					          fontSizep={17}
  					          selectIndexNum={user[0].kolvo-1}
  					          handler={(selection, row) => alert(data[selection][row])}
  					          updateKolvo={updateKolvo.bind(this)}>

  					         </DropdownMenu>

  						</View>


  			             <View style={styles.pricebox}>
  				             <View style={styles.priceborder}>
  								<Text style={styles.price}>
  						          {user[0].price} ₽
  						        </Text>
  						    </View>

  						 </View>
  			            </View>
  		           	</Swipeout>
  		          ))}
  		        </View>;
        }
        else{
          activIND = <View style={styles.viewZero}>
                        <Text style={styles.titlezero}>В вашей корзине еще нет товаров.</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Feed');}}>
                          <Text style={styles.titlezerolink}>Перейти в меню</Text>
                        </TouchableOpacity>
                     </View>
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

		      <ScrollView style={styles.black}>

		           {activIND}

		      </ScrollView>
      <View style={styles.pricebordersumm}>
      		<View style={styles.rowsort}>
	      		<Text style={styles.summtext}> Сумма: </Text>
		      		<TouchableOpacity style={styles.priceborder}>
		      			<Text style={styles.price}>{this.state.summtovar} ₽</Text>
		      		</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.buttbackbox} onPress={() => this.onLearnMore()}>
					     <Text style={ styles.buttbacktext }>ОФОРМИТЬ ЗАКАЗ</Text>
			</TouchableOpacity>
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
    flex: 1,
    backgroundColor: '#000',
  },
  listItem: {
	flexDirection:'row',

  },

  title: {
	fontSize: 16,
	color: '#fff9ee',
	marginLeft: 5,
  },
  viewZero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  titlezero:{
    fontSize: 16,
  	color: '#fff9ee',
  },
  titlezerolink:{
    fontSize: 16,
  	color: '#8d7952',
    textDecorationLine: 'underline',
  },
  hrefarea:{
	  marginBottom: 10,
  },
  imgmini:{
	  height:60,
	  width:60,
	  flex:2,
  },
  sostav: {
	fontSize: 12,
	color: '#fff9ee',
	marginTop: 5,
  },
  textbox: {
	  flex: 7,
	  justifyContent:'center',
	  height:60,
  },
  nextbutt:{
	  marginTop: 5,
	  width:20,
	  height:20,
  },
  pricebox: {
		flex: 4,
		alignItems: 'center',

	},
	price: {
		color: '#fff9ee',
		fontSize: 15

	},
	priceborder: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 5,
		marginTop: 20,
		paddingBottom: 5,
		alignItems: 'center',
		borderRadius: 5,
		borderWidth: 0.7,
		borderColor: '#fff9ee'
	},

  selectedListItem: {
    color: 'green'
  },
  black: {
	  backgroundColor: '#000',
	  flex: 1,
  },

  dropmenu: {
	  fontSize: 20,
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
  dropdownmenu: {
	  width: 80,

	  paddingTop:10,
	  margin:0,
  },
  pricebordersumm:{
		height:140,
		borderTopColor:'#fff9ee',
		borderTopWidth: 1,
		alignItems: 'center',

  },
  summtext:{
		color: '#fff9ee',
		fontSize: 18,
		paddingTop:15,
		paddingRight:5,
		backgroundColor:'rgba(0,0,0,0)',
  },
  rowsort:{
		 flexDirection:'row',
		 justifyContent:'center',
		 alignItems: 'center',
		 height: 30,
		 paddingTop:15,
		 paddingBottom: 10,
  },
  buttbackbox: {
		width:250,
		height:50,
		borderRadius: 5,
		borderWidth: 1,
		marginTop: 30,
		borderColor: '#fcf5e9',
		backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent:'center',
	},
	buttbacktext: {
		fontSize:20,
		color: '#fcf5e9',
		backgroundColor: 'rgba(0,0,0,0)',
	},
});


export default Cart;
