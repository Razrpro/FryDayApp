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


class Feed extends Component {
  onLearnMore = (user) => {
    this.props.navigation.navigate('Details', { ...user,ScreeF: this });
  };



  componentDidMount() {

     fetch('https://appcafe.ru/api2.php?do=getMenuList&userid='+USERID+'&tip='+this.state.sortRazdel)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
        }, function() {
          console.log("Loading INTERFACE!");
          this.users = responseJson;
          //console.log(users);
        });
      })
      .catch((error) => {
        console.error(error);
      });

      fetch('https://appcafe.ru/api2.php?do=getRazdelList&userid='+USERID+'')
      .then((response) => response.json())
      .then((responseJson) => {


		this.setState({
          razdelmenu: responseJson,
          isLoading: false,
          isLoadingRazdel: false,
          selected: false,

        });

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


  constructor(props) {
    super(props);

    // Bind the this context to the handler function
    this.updateRazdel = this.updateRazdel.bind(this);

    this.state = {
      isLoading: true,
      isLoadingRazdel: true,
      sortRazdel: 0,
      razdelmenu: null,
      kolvotovar: 0,
      summtovar: 0,
      isLoadingKorzina: true,

    }



  }


   changeFirst(newValue) {
    this.setState({
      first: newValue,
    });
  }

  updateRazdel(param1) {
  	console.log('log:'+param1);

  	this.setState({
          isLoadingRazdel: true,

        });

  	fetch('https://appcafe.ru/api2.php?do=getMenuList&userid='+USERID+'&tip='+param1)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          sortRazdel: param1,
           isLoadingRazdel: false,
        }, function() {
          console.log("UPDATE INTERFACE!");
          this.users = responseJson;
          //console.log(users);
        });
      })
      .catch((error) => {
        console.error(error);
      });

  }




  render() {


	 //--------корзина в топе ----------------
	 if(this.state.isLoadingKorzina){
		 SHOPING_CART_TOP = <ActivityIndicator />

	 }
	 else{
		 console.log("k:"+this.state.kolvotovar+" s:"+this.state.summtovar);
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
	 //------//--корзина в топе -----------

	  var updateRazdel  =   this.updateRazdel;

	  if (!this.state.isLoading) {

			var data2 = this.state.razdelmenu.map(function(value, index) {
		    	return [value];
			});

			  var data = [data2];
			  console.log('ARRA:'+data);
	  //[[["Салаты"], ["Салаты2"]]];
			dropdownMENU =  <View style={styles.dropdownmenu}>
			  	<DropdownMenu
			  //  arrowImg={{ uri: IMGPATH+'nextnew.png' }}      //set the arrow icon, default is a triangle
		      //  checkImage={{ uri: IMGPATH+'nextnew.png' }}    //set the icon of the selected item, default is a check mark
		          bgColor={"black"}                            //the background color of the head, default is grey
		          tintColor={"white"}                          //the text color of the head, default is white
		      //  selectItemColor={"red"}                      //the text color of the selected item, default is red
		          data={data}
		          maxHeight={410}                            // the max height of the menu
		          handler={(selection, row) => alert(data[selection][row])}
		          updateRazdel={updateRazdel.bind(this)}>

		         </DropdownMenu>

			  </View>;

    	}
		else{

			dropdownMENU = <ActivityIndicator />;
		}


    console.log('st'+data);


      if(this.state.isLoadingRazdel || typeof this.state.dataSource == 'undefined'){
	      activIND = <ActivityIndicator />;
	  }
      else{
	      activIND = <View style={styles.container}>
		          {this.state.dataSource.map((user) => (
			        <TouchableOpacity onPress={() => this.onLearnMore(user)} key={user.id} style={styles.hrefarea}>
			            <View style={styles.listItem}>



			              <Image source={{ uri: IMGPATH+user.imgmini }} style={styles.imgmini} />


			             <View style={styles.textbox}>
			             	<Text style={styles.title}>{user.name}</Text>
						 	<Text style={styles.sostav}>{user.sostav}</Text>
			             </View>
			             <View style={styles.pricebox}>
				             <View style={styles.priceborder}>
								<Text style={styles.price}>
						          {user.price} ₽
						        </Text>
						    </View>
						    <Image source={{ uri: IMGPATH+'nextnew.png' }} style={styles.nextbutt} />
						 </View>
			            </View>
		            </TouchableOpacity>

		          ))}
		        </View>;
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
	  		{dropdownMENU}



		      <ScrollView style={styles.black}>

		      	{activIND}

		      </ScrollView>

     </View>
    );
    }


}

 /* <List style={styles.container}>
          {users.map((user) => (
            <ListItem
              key={user.login.username}
              style={styles.listItem}
              avatar={<Image source={{ uri: user.picture.thumbnail }} style={{ height:100, width:100 }} />}
              title={<Text style={styles.title}> {user.name.first.toUpperCase()} {user.name.last.toUpperCase()} </Text>}
              subtitle={<Text style={styles.email}> {user.email} </Text>}
              onPress={() => this.onLearnMore(user)}>
            </ListItem>

          ))}
        </List>*/

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
  },
  hrefarea:{
	  marginBottom: 10,
  },
  imgmini:{
	  height:120,
	  width:120,
	  flex:5,
  },
  sostav: {
	fontSize: 12,
	color: '#fff9ee',
	marginTop: 5,
  },
  textbox: {
	  flex: 7,
	  paddingTop: 10,
	  paddingLeft: 10,
	  paddingBottom: 10,
  },
  nextbutt:{
	  marginTop: 5,
	  width:20,
	  height:20,
  },
  pricebox: {
		flex: 4,
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
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
    zIndex: 1,
  },
  dropdownmenu: {
	  minHeight: 50,
	  zIndex: 999,
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
		justifyContent:'center',
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


export default Feed;
