import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, StatusBar, Dimensions, Text, Keyboard, AsyncStorage } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'

import { USERID, IMGPATH, MINIMUM_DOST_TIME, MAXIMUM_DOST_TIME } from '../config/config'

 const hw = Dimensions.get('window').height-80;
 
class Oformlenie extends Component {
	
	
	
   constructor(props) {
    super(props);
    
   
    
    this.state = {
      titlephone: '', 
      error1: false,
      error2: false,
      error3: false, 
      greyscolor: false,
      dostavkaORsamoviviz: 0,
      date:"",
      height:hw,
      scrollToElement:0,
      keyboardShow: false,
    }	  

  } 
  
   componentWillMount () {
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardDidHide(e));
	  }

	   componentWillUnmount () {
	    this.keyboardDidHideListener.remove();
	  }
	  	   
	  _keyboardDidHide = (e) => {
		 
	    this.MyUpdateScroll(this.state.scrollToElement);
	  }

  MyUpdateScroll (element) {
	 
	  this.refs._scrollView.scrollTo({y: element*50 });
	  this.setState({ scrollToElement: element });
  }
  goZakaz() {
	  
	  	AsyncStorage.getItem('Tovar',(err, result) => {
			console.log('ASYNC LOAD2!'+result);
		
			  
			   fetch('https://appcafe.ru/api2.php?do=goZakaz&userid='+USERID+
			  '&phone='+this.state.titlephone+
			  '&name='+this.state.titlename+
			  '&tipdostavki='+this.state.dostavkaORsamoviviz+
			  '&adress='+this.state.titleadress+
			  '&podezd='+this.state.titlepodezd+
			  '&domofon='+this.state.titledomofon+
			  '&etazh='+this.state.titleetazh+
			  '&kvartira='+this.state.titlekvartira+
			  '&comment='+this.state.titlecomment+
			  '&zakaz='+result)
		      .then((response) => response.json())
		      .then((responseJson) => { 
		         
		          console.log("Sending zakaz!");
		          
		          if(responseJson[0]=="error")
		          {
			      		alert('Ошибка отправки заказа, попробуйте еще раз!');
		          }
		          else{

							  alert('Ваш заказ принят!');
							  this.props.navigation.goBack();
		          }
		         
		      })
		      .catch((error) => {
		        console.error(error); 
			  });	        		 
	        
		});	      
        	
	  
	 
	}
   
  render() {
	
	
	error1 = (this.state.error1)?<FormValidationMessage>{'Не заполнен телефон!'}</FormValidationMessage>:<View />;
	error2 = (this.state.error2)?<FormValidationMessage>{'Не заполнено имя!'}</FormValidationMessage>:<View />;
	error3 = (this.state.error3)?<FormValidationMessage>{'Введите адрес!'}</FormValidationMessage>:<View />;

	disabled = (this.state.greyscolor)?false:true;

	var min_d = new Date(); // get current date
	min_d.setHours(min_d.getHours(),min_d.getMinutes()+MINIMUM_DOST_TIME,0,0);
	
	var max_d = new Date(); // get current date
	max_d.setHours(max_d.getHours(),max_d.getMinutes()+MAXIMUM_DOST_TIME,0,0);


	forms = <View>
				<FormLabel containerStyle={styles.labelContainerStyle}>Ваш телефон:</FormLabel>
			  	<FormInput editable={disabled} style={styles.textdef} value={this.state.titlephone} keyboardType='phone-pad' onChangeText={(titlephone) => {this.setState({titlephone})} }/>
			  	{error1}
			  	
			  	<FormLabel containerStyle={styles.labelContainerStyle}>Ваше имя:</FormLabel>
			  	<FormInput editable={disabled} style={styles.textdef} value={this.state.titlename} onChangeText={(titlename) => {this.setState({titlename})} } onFocus={() => {this.MyUpdateScroll(2)}}/>
			  	{error2}
			  	
			  	<FormLabel containerStyle={styles.labelContainerStyle}>Адрес для доставки:</FormLabel>
			  	
			  	
			  	<FormInput editable={disabled} style={styles.textdef} placeholder="Город, улица, дом" placeholderTextColor="#434343" value={this.state.titleadress} onChangeText={(titleadress) => {this.setState({titleadress})} } onFocus={() => {this.MyUpdateScroll(3)}}/>
			  	{error3}
			  	<View style={styles.rowsort}>
			  		<FormInput editable={disabled} style={styles.proc50} placeholder="Подъезд" placeholderTextColor="#434343" value={this.state.titlepodezd} onChangeText={(titlepodezd) => {this.setState({titlepodezd})} } onFocus={() => {this.MyUpdateScroll(4)}}/>
			  		<FormInput editable={disabled} style={styles.proc50} placeholder="Домофон" placeholderTextColor="#434343" value={this.state.titledomofon} onChangeText={(titledomofon) => {this.setState({titledomofon})} } onFocus={() => {this.MyUpdateScroll(4)}}/>
			  	</View>
			  	<View style={styles.rowsort}>
			  		<FormInput editable={disabled} style={styles.proc50} placeholder="Этаж" placeholderTextColor="#434343" value={this.state.titleetazh} onChangeText={(titleetazh) => {this.setState({titleetazh})} } onFocus={() => {this.MyUpdateScroll(5)}}/>
			  		<FormInput editable={disabled} style={styles.proc50} placeholder="Квартира/Офис" placeholderTextColor="#434343" value={this.state.titlekvartira} onChangeText={(titlekvartira) => {this.setState({titlekvartira})} } onFocus={() => {this.MyUpdateScroll(5)}}/>
			  	</View>
			  	
			  	<FormLabel containerStyle={styles.labelContainerStyle}>Комментарий:</FormLabel>
			  	<FormInput editable={disabled} style={styles.commentadressstyle} value={this.state.titlecomment} multiline={true}  onChangeText={(titlecomment) => {this.setState({titlecomment})} } onFocus={() => {this.MyUpdateScroll(5)}}/>
		  	</View>;
		  	
	greyscolor = (this.state.greyscolor)?<TouchableOpacity style={styles.greyscolor}>{forms}</TouchableOpacity>:<View>{forms}</View>;


	if(this.state.dostavkaORsamoviviz==1){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavkion}>Доставка</Text>
					   	</TouchableOpacity>;
		
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavki}>Самовывоз</Text>
				       	</TouchableOpacity>;
				    
		timeornow = <View style={styles.tipdostavkiboxcenter}>
				        <View style={styles.tipdostavkibox}>
							       		<TouchableOpacity style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: false, dostavkaORsamoviviz:3 });  }}>
							       			<Text style={styles.textdostavki}>Доставить сейчас</Text>
							       		</TouchableOpacity>
							       		
										<DatePicker
										style={styles.rightboxtipdostavkicontaner}
								        date={this.state.date}
								        mode="datetime"
								        placeholder="Доставить ко времени"
								        minDate={min_d}
								        maxDate={max_d}
								        format="DD.MM.YY в HH:mm"
								        confirmBtnText="Выбрать"
								        cancelBtnText="Отменить"
								        showIcon={false}
								        customStyles={{
								          	  dateInput: {
											    flex: 1,
												alignItems: 'center',
												justifyContent:'center',
												borderWidth:0,
												borderColor:'#000000',
											  },
											  dateText: {
											    color: '#fcf5e9',
												fontSize: 14,
											  },
											  placeholderText: {
											    color: '#fcf5e9',
											  },

								        }}
								        onDateChange={(date) => {this.setState({date: date,greyscolor: false, dostavkaORsamoviviz:5 })}}
										/>

							       		
							       		
						</View>
			        </View>;
	}
	else if(this.state.dostavkaORsamoviviz==2){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavki}>Доставка</Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavkion}>Самовывоз</Text>
				       	</TouchableOpacity>;
					   	
		timeornow = <View style={styles.tipdostavkiboxcenter}>
				        <View style={styles.tipdostavkibox}>
							       		<View style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: false, dostavkaORsamoviviz:4 }); }}>
							       			<Text style={styles.textdostavki} onPress={() => { this.setState({ greyscolor: false, dostavkaORsamoviviz:4 }); }}>Забрать сейчас</Text>
							       		</View>
							       		<DatePicker
										style={styles.rightboxtipdostavkicontaner}
								        date={this.state.date}
								        mode="datetime"
								        placeholder="Забрать ко времени"
								        minDate={min_d}
								        maxDate={max_d}
								        format="DD.MM.YY в HH:mm"
								        confirmBtnText="Выбрать"
								        cancelBtnText="Отменить"
								        showIcon={false}
								        customStyles={{
								          	  dateInput: {
											    flex: 1,
												alignItems: 'center',
												justifyContent:'center',
												borderWidth:0,
												borderColor:'#000000',
											  },
											  dateText: {
											    color: '#fcf5e9',
												fontSize: 14,
											  },
											  placeholderText: {
											    color: '#fcf5e9',
											  },

								        }}
								        onDateChange={(date) => {this.setState({date: date,greyscolor: false, dostavkaORsamoviviz:6 })}}
										/>
						</View>
			        </View>;
	}
	else if(this.state.dostavkaORsamoviviz==3){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavkion}>Доставить сейчас</Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavki}>Самовывоз</Text>
				       	</TouchableOpacity>;
					   	
		timeornow = <View />;
	}
	else if(this.state.dostavkaORsamoviviz==4){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavki}>Доставка</Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavkion}>Забрать сейчас</Text>
				       	</TouchableOpacity>;
					   	
		timeornow = <View />;
	}
	else if(this.state.dostavkaORsamoviviz==5){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavkion}>Доставка {this.state.date}</Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavki}>Забрать сейчас</Text>
				       	</TouchableOpacity>;
					   	
		timeornow = <View />;
	}
	else if(this.state.dostavkaORsamoviviz==6){
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavki}>Доставка </Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaneron} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavkion}>Забрать {this.state.date}</Text>
				       	</TouchableOpacity>;
					   	
		timeornow = <View />;
	}
	else{
		dostavkabutt = 	<TouchableOpacity style={styles.leftboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:1 });  }}>
				       			<Text style={styles.textdostavki}>Доставка</Text>
					   	</TouchableOpacity>;
					   	
		samovivozbutt = <TouchableOpacity style={styles.rightboxtipdostavkicontaner} onPress={() => { this.setState({ greyscolor: true, dostavkaORsamoviviz:2 }); }}>
				       			<Text style={styles.textdostavki}>Самовывоз</Text>
				       	</TouchableOpacity>;
				       	
		timeornow = <View />
	}
	

	
	
	return (
	 <View style={ styles.black }>
	  <StatusBar barStyle="light-content"/>
	  <View style={styles.header}>  
	    <TouchableOpacity
          onPress={() => { 
	         this.props.navigation.goBack(); 
	      }}
          style={styles.button}
        >
        <Image source={{ uri: IMGPATH+'backiconew.png' }} style={ styles.menu } />
        </TouchableOpacity>
        
	  	<Image source={{ uri: IMGPATH+USERID+'/logonew.png' }} style={ styles.logo } /> 
	  	
	  	{SHOPING_CART_TOP}
	  
	  	
	  </View>
	  <View>
	      <ScrollView style={{ height:this.state.height-140 }} ref='_scrollView'>
	      	
	      	<View style={styles.titlebox}>
	        	<Text style={styles.titletext}>Оформление заказа</Text>
	        </View>
	        
	        <View style={styles.tipdostavkiboxcenter}>
		        <View style={styles.tipdostavkibox}>
					       		{dostavkabutt}
					       		{samovivozbutt}
					       		
				</View>
	        </View>
	        
	        	{timeornow}
	     
	        	{greyscolor}
		 
		       
	      </ScrollView>
	  <View style={styles.pricebordersumm}>
      		
			<TouchableOpacity style={styles.buttbackbox} onPress={() => this.goZakaz()}>
					     <Text style={ styles.buttbacktext }>ПОДТВЕРДИТЬ ЗАКАЗ</Text>
			</TouchableOpacity>
      </View>

	  </View>
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
	  flex:1,
	  backgroundColor: '#000',
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
		 width: win.width,
		 height: 50,
		 marginTop: 10,
  },
  buttbackbox: {
		width:250,
		height:50,
		borderRadius: 5,
		borderWidth: 1,	
		marginTop: 30,
		marginBottom: 40,
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
	titleadressstyle:{
		height:50,
		color: '#cccccc',
		fontSize:18,	
	},
	commentadressstyle: {
		height:160,
		color: '#cccccc',
		fontSize:18,
	},
	proc50:{
		width: (win.width/2)-40,
		height:50,
		color: '#cccccc',
	},
	textdef:{
		color: '#cccccc',
		fontSize:18,	
		height:40,
	},
	titletext: {
		fontSize: 22,
		color: '#fff9ee',
		paddingBottom: 20,
	},
	titlebox:{
		width: win.width,
		alignItems: 'center',
		justifyContent:'center',
		paddingTop: 10,
	},
	tipdostavkiboxcenter:{
		width: win.width,
		alignItems: 'center',
		justifyContent:'center',
	},
	tipdostavkibox:{
		borderRadius: 5,
		borderWidth: 1,	
		borderColor: '#fcf5e9',
		width:win.width-40,
		height:50,
		backgroundColor: 'rgba(0,0,0,0)',
		flexDirection:'row',
		marginBottom:10,
	},
	leftboxtipdostavkicontaner: {
		borderRightWidth: 1,
		borderRightColor: '#fcf5e9',
		flex: 1,
		alignItems: 'center',
		justifyContent:'center',
	},
	leftboxtipdostavkicontaneron: {
		borderRightWidth: 1,
		borderRightColor: '#fcf5e9',
		backgroundColor:'#ffffff',
		flex: 1,
		alignItems: 'center',
		justifyContent:'center',
	},
	rightboxtipdostavkicontaner: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center',
		borderColor: '#000000',
		height:50,
	},
	rightboxtipdostavkicontaneron: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center',
		backgroundColor:'#ffffff',
	},
	textdostavki: {
		color: '#fcf5e9',
		fontSize: 14,
		lineHeight:20,
	},
	textdostavkion: {
		color: '#000000',
		fontSize: 14,
		lineHeight:20,
	},

	greyscolor: {
		opacity: 0.3,
	},
	centerview: {
		height:140,
		alignItems: 'center',
	}
});

export default Oformlenie;