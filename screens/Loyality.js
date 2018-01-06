import {
  Camera,
  Video,
  BarCodeScanner,
  FileSystem,
  Permissions,
} from 'expo';

import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Image, ImageBackground, Text, TouchableOpacity, TextInput, Button, Keyboard, TouchableWithoutFeedback, ActivityIndicator, AsyncStorage, NavigatorIOS, Linking, StatusBar, List, ListItem } from 'react-native';
import QRCode from 'react-native-qrcode';

import { USERID, IMGPATH } from '../config/config'

class Loyality extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    phone: '',
	    code1: '',
	    code2: '',
	    code3: '',
	    code4: '',
	    startReg: false,
	    codeReg:false,
	    codeConfirm: false,
	    confirmReg: false,
	    myBalls: false,
	    qrCodeMD5: '',
	    qrCode: false,
	    qrCodeAprove: false,
	    myBallsCount: 0,
	    transactionID: '',
	    transactionTYPE:0,
	    transactionUID:0,
	    transactionSUMM: '',
	    transactionBALLS: 0,
	    isLoadingKorzina: true,
	    kolvotovar: 0,
	    summtovar: 0,
    };

  }


   componentDidMount() {

		const { status } =  Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });

	  	AsyncStorage.getItem("UPHONE").then((value_phone) => {
	  		if(value_phone!=null){
				AsyncStorage.getItem("UCODE").then((value_code) => {
					if(value_code!=null){
						console.log('CACHEphone:'+value_phone+' CACHEcode:'+value_code);

						 this.setState({
							 	   code1: value_code,
							 	   phone: value_phone,
								   codeConfirm: true,

   					     });

					}
	  			});
	  		}
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

		      //  }
		 });		}

  render() {

	 if(this.state.startReg){
		   console.log('Zapros api startReg');

		     fetch('https://appcafe.ru/api2.php?do=regNewUser&userid='+USERID+'&newUserPhone='+this.state.phone)
		      .then((response) => response.json())
		      .then((responseJson) => {

		          console.log("Registering NEW user!");

		          if(responseJson[0]=="error")
		          {
			      		alert('Не верный формат телефона');
			      		this.setState({startReg:false});
		          }
		          else{

							   this.setState({
								   codeReg:true,
								   startReg:false,
								   });
		          }

		      })
		      .catch((error) => {
		        console.error(error);
		 });

	      screen = <ActivityIndicator />;
	  }
	  else if(this.state.codeReg){



			          screen = <ImageBackground source={{ uri: IMGPATH+'fon_reg.jpg' }} style={ styles.backgroundimgreg }>
								  <View style={styles.textviewCode}>
								  	<Text style={ styles.textreg }>Введите код</Text>
								  	<Text style={ styles.textreg }>подтверждения</Text>
							      </View>
							      <View style={styles.codeContainer}>
								       <View style={styles.codebox}>
								       			<TextInput
								       			  ref='RefInput1'
										          style={styles.codeboxtext}
										          value={this.state.code1}
										          keyboardType = "phone-pad"
										          maxLength = {1}
										          autoFocus = {true}
										          onChangeText={(code1) => {this.setState({code1}), this.refs.RefInput2.focus()} }
										        />
								       </View>
								       <View style={styles.codebox}>
								       			<TextInput
								       			  ref='RefInput2'
										          style={styles.codeboxtext}
										          value={this.state.code2}
										          keyboardType = "phone-pad"
										           maxLength = {1}
										          placeholderTextColor="#434343"
										          onChangeText={(code2) => {this.setState({code2}), this.refs.RefInput3.focus()} }
										        />
								       </View>
								       <View style={styles.codebox}>
								       			<TextInput
								       			  ref='RefInput3'
										          style={styles.codeboxtext}
										          value={this.state.code3}
										           maxLength = {1}
										          keyboardType = "phone-pad"
										          placeholderTextColor="#434343"
										          onChangeText={(code3) => {this.setState({code3}), this.refs.RefInput4.focus()} }
										        />
								       </View>
								       <View style={styles.codebox}>
								       			<TextInput
								       			  ref='RefInput4'
										          style={styles.codeboxtext}
										          value={this.state.code4}
										           maxLength = {1}
										          keyboardType = "phone-pad"
										          placeholderTextColor="#434343"
										          onChangeText={(code4) => {this.setState({code4}),
										          							 	this.refs.RefInput1.focus(),
																	           	this.setState({
																				   codeReg:false,
																				   codeConfirm:true,
																				});
								   				   							}}
										        />
								       </View>
							      </View>

							       <View style={styles.textsoglasheniebox}>
							       		<Text style={ styles.textsoglashenie }>В течение нескольких минут к вам на телефон придет СМС-сообщение с 4х-значным кодом подтверждения</Text>
							       </View>
							   </ImageBackground>;



	  }
	  else if(this.state.codeConfirm){


		   console.log('Try confirm code'+'https://appcafe.ru/api2.php?do=tryConfirmAcc&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4);

		     fetch('https://appcafe.ru/api2.php?do=tryConfirmAcc&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4)
		      .then((response) => response.json())
		      .then((responseJson) => {


		          if(responseJson[0]=="error")
		          {
			      		alert('Не верный код подтверждения!');
			      		console.log(responseJson[0]);
			      		this.setState({
				      			code1:'',
				      			code2:'',
				      			code3:'',
				      			code4:'',
					      		codeConfirm:false,
					      		codeReg:true,
				      		});



		          }
		          else{
			          	console.log("USER_DATA:"+responseJson[0].balls);
				  				AsyncStorage.setItem('UPHONE',this.state.phone);
				  				AsyncStorage.setItem('UCODE',this.state.code1+this.state.code2+this.state.code3+this.state.code4);


				  			if(responseJson[0].group){
				  				this.setState({
					  				codeConfirm:false,
				  					qrCodeCamera:true,
				  				});
				  			}
				  			else{
							   this.setState({
								   codeConfirm:false,
								   myBalls:true,
								   myBallsCount: responseJson[0].balls,
								   });
							}

		          }

		      })
		      .catch((error) => {
		        console.error(error);
		     });


	  }
	  else if(this.state.myBalls) {


		   screen =  <ImageBackground source={{ uri: IMGPATH+'fon_reg.jpg' }} style={ styles.backgroundimgreg }>
			   			<View style={styles.textviewballs}>
						  	<Text style={ styles.textballs }>Ваши баллы:</Text>
						  	<Text style={ styles.textballsCount }>{this.state.myBallsCount}</Text>
						</View>
						<View style={styles.buttballsbox}>

						  	<TouchableOpacity
						  	  style={styles.buttballsboxleft}
					          onPress={() => {


						          		fetch('https://appcafe.ru/api2.php?do=getQRPoluchitBalls&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4)
									      .then((response) => response.json())
									      .then((responseJson) => {


									          if(responseJson[0]=="error")
									          {
										      		alert('Ошибка запроса на получение баллов, попробуйте еще раз!');

									          }
									          else{
														   this.setState({
															   qrCodeMD5:responseJson[0],
															   myBalls:false,
															   qrCode:true,
															   });
									          }

									      })
									      .catch((error) => {
									        console.error(error);
									     });

								 } }
							>
								<Text style={ styles.buttballsboxlefttext }>Получить баллы </Text>
							</TouchableOpacity>

							<TouchableOpacity
						  	  style={styles.buttballsboxright}
					          onPress={() => {


						          		fetch('https://appcafe.ru/api2.php?do=getQRZaplatitBalls&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4)
									      .then((response) => response.json())
									      .then((responseJson) => {


									          if(responseJson[0]=="error")
									          {
										      		alert('Ошибка запроса на получение баллов, попробуйте еще раз!');

									          }
									          else{
														   this.setState({
															   qrCodeMD5:responseJson[0],
															   myBalls:false,
															   qrCode:true,
															   });
									          }

									      })
									      .catch((error) => {
									        console.error(error);
									     });

								 } }
							>
								<Text style={ styles.buttballsboxrighttext }>Потратить баллы</Text>
							</TouchableOpacity>


						</View>
						<View style={styles.ballslc}>
							<Image source={{ uri: IMGPATH+'lichniy_cabinet.png' }} style={ styles.lichniycabinetimg } />
						  	<Text style={ styles.ballslctext }>Заполнить личные данные</Text>
						</View>

						   <TouchableOpacity
					          onPress={() => {


						        			AsyncStorage.setItem('UPHONE','');
							  				AsyncStorage.setItem('UCODE','');

					          } }
					        >
					        	<Text color="red">Выйти из системы</Text>
					        </TouchableOpacity>
					</ImageBackground>
;

	  }
	  else if(this.state.qrCode){

		   var timer = setInterval(() => {
		  	 console.log('Zapros GetQR!');


		  	 					fetch('https://appcafe.ru/api2.php?do=getQRPoluchitBallsTimer&operationid='+this.state.qrCodeMD5)
									      .then((response) => response.json())
									      .then((responseJson) => {


									          if(responseJson[0]=="ok")
									          {
										          clearInterval(timer);
										      		 this.setState({
															   qrCode:false,
															   codeConfirm:true,
													 });

									          }


									      })
									      .catch((error) => {
									        console.error(error);
								});



		   }, 2000);


			screen = <ImageBackground source={{ uri: IMGPATH+'fon_reg.jpg' }} style={ styles.backgroundimgreg }>
			   			<View style={styles.textviewqr}>
						  	<Text style={ styles.textqrhead }>Покажите этот QR-код</Text>
						  	<Text style={ styles.textqrhead }>официанту для начисления</Text>
						  	<Text style={ styles.textqrhead }>баллов:</Text>
						</View>

						<View style={styles.qrview}>
							  <QRCode
					          value={this.state.qrCodeMD5}
					          size={250}
					          bgColor='white'
					          fgColor='black'/>
					     </View>

					     <TouchableOpacity style={styles.buttbackbox}
					     	onPress={() => {
						     		clearInterval(timer);
						      		this.setState({
										qrCode:false,
										myBalls:true,
									});
					          } }
					     >
					     	<Text style={ styles.buttbacktext }>НАЗАД</Text>
					     </TouchableOpacity>

				     </ImageBackground>
	  }
	  else if(this.state.qrCodeCamera){

	      screen =
		        <View style={{ flex: 1 }}>

					<BarCodeScanner
						onBarCodeRead={this._handleBarCodeRead}
						style={StyleSheet.absoluteFill}
					/>

		        </View>;


	  }
	  else if(this.state.qrCodeAprove){

		  var operationTYPE = '';
		  if(this.state.transactionTYPE==1) {

			  screen =
			  <View style={styles.aproveview}>

		          <View style={styles.textview}>
				  	<Text style={ styles.textreg }>Вы выполняете операцию </Text>
				  	<Text style={ styles.texttransactiongreen }>начисления баллов</Text>
				  	<Text style={ styles.textreg }>пользователю #{this.state.transactionUID}</Text>
				  	<Text style={ styles.textphone }>Введите cумму:</Text>
			      </View>
			      <View style={styles.summrow}>
				       <View style={styles.summbox}>

				       			<TextInput
						          style={styles.summboxtextsumm}
						          keyboardType = "phone-pad"
						          onChangeText={(transactionSUMM) => this.setState({transactionSUMM})}
						        />

				       </View>

				       <TouchableOpacity style={styles.summbuttongreen}
					     	onPress={() => {

							     		if(this.state.transactionSUMM){

								     		fetch('https://appcafe.ru/api2.php?do=adminTransactionStep2&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4+'&transaction='+this.state.transactionID+'&summ='+this.state.transactionSUMM)
										      .then((response) => response.json())
										      .then((responseJson) => {

										          console.log('TRANSACTION!: '+responseJson[0]);
										          if(responseJson[0]=="ok")
										          {
											          alert(this.state.transactionSUMM+' баллов успешно начислено пользователю №'+this.state.transactionUID);
											     		this.setState({
												 			transactionSUMM:'',
															qrCodeAprove:false,
															qrCodeCamera:true,
														});


										          }


										      })
										      .catch((error) => {
										        console.error(error);
										});


						     		}
						     		else{
							     		alert('Не корректная сумма!');
								     		this.setState({
								     		transactionSUMM:'',
											qrCodeAprove:false,
											qrCodeCamera:true,
										});
						     		}

					          } }
					     >
				       			<Text style={ styles.summboxtextsumm }>ВЫПОЛНИТЬ</Text>
				       </TouchableOpacity>
				   </View>
				   <TouchableOpacity style={styles.summcancelbox}
					     	onPress={() => {

						     		this.setState({
										qrCodeAprove:false,
										qrCodeCamera:true,
									});
					          } }
					     >
					     	<Text style={ styles.summcanceltext }>Отмена транзакции</Text>
					</TouchableOpacity>
		        </View>;

		  }
		  else{
		  	  screen =
			  <View style={styles.aproveview}>

		          <View style={styles.textview}>
				  	<Text style={ styles.textreg }>Вы выполняете операцию </Text>
				  	<Text style={ styles.texttransactionred }>списания баллов</Text>
				  	<Text style={ styles.textreg }>пользователю #{this.state.transactionUID}</Text>
				  	<Text style={ styles.textphone }>Введите cумму (макс. {this.state.transactionBALLS}):</Text>
			      </View>
			      <View style={styles.summrow}>
				       <View style={styles.summbox}>

				       			<TextInput
						          style={styles.summboxtextsumm}
						          keyboardType = "phone-pad"
						          onChangeText={(transactionSUMM) => this.setState({transactionSUMM})}
						        />

				       </View>

				       <TouchableOpacity style={styles.summbuttonred}
					     	onPress={() => {

						     		if(this.state.transactionSUMM && this.state.transactionSUMM<=this.state.transactionBALLS){

								     		fetch('https://appcafe.ru/api2.php?do=adminTransactionStep2&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4+'&transaction='+this.state.transactionID+'&summ='+this.state.transactionSUMM)
										      .then((response) => response.json())
										      .then((responseJson) => {

										          console.log('TRANSACTION!: '+responseJson[0]);
										          if(responseJson[0]=="ok")
										          {
											          alert(this.state.transactionSUMM+' баллов успешно списано у пользователя №'+this.state.transactionUID);
											     		this.setState({
												 			transactionSUMM:'',
															qrCodeAprove:false,
															qrCodeCamera:true,
														});


										          }


										      })
										      .catch((error) => {
										        console.error(error);
										});

						     		}
						     		else{
							     		alert('Не корректная сумма!');
								     		this.setState({
								     		transactionSUMM:'',
											qrCodeAprove:false,
											qrCodeCamera:true,
										});
						     		}
					          } }
					     >
				       			<Text style={ styles.summboxtextsumm }>ВЫПОЛНИТЬ</Text>
				       </TouchableOpacity>
				   </View>
				   <TouchableOpacity style={styles.summcancelbox}
					     	onPress={() => {
						     		this.setState({
							     		transactionSUMM:'',
										qrCodeAprove:false,
										qrCodeCamera:true,
									});
					          } }
					     >
					     	<Text style={ styles.summcanceltext }>Отмена транзакции</Text>
					</TouchableOpacity>
		        </View>;
		  }



	  }
      else{
	  	  screen = <ImageBackground source={{ uri: IMGPATH+'fon_reg.jpg' }} style={ styles.backgroundimgreg }>
				  <View style={styles.textview}>
				  	<Text style={ styles.textreg }>Чтобы получить доступ </Text>
				  	<Text style={ styles.textreg }>к вашим баллам,</Text>
				  	<Text style={ styles.textreg }>нужно зарегестрироваться</Text>
				  	<Text style={ styles.textphone }>Введите телефон:</Text>
			      </View>
			       <View style={styles.phonebox}>
			       		<View style={styles.leftboxphonecontaner}>
			       			<Text style={styles.lefttextphone}>+7</Text>
			       		</View>
			       		<View style={styles.rightboxphonecontaner}>
			       			<TextInput
					          style={styles.righttextphone}
					          placeholder="909 656 77 88"
					          keyboardType = "phone-pad"
					          placeholderTextColor="#434343"
					          onChangeText={(phone) => this.setState({phone})}
					        />
			       		</View>
			       </View>
			       <TouchableOpacity onPress={() => this.setState({startReg: true})}>
				       <View style={styles.buttonregbox}>
								<Text style={ styles.buttonreg }>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
				       </View>
			       </TouchableOpacity>
			       <View style={styles.textsoglasheniebox}>
			       		<Text style={ styles.textsoglashenie }>Я принимаю условия </Text><TouchableOpacity><Text style={ styles.hreflink }>Пользовательского соглашения</Text></TouchableOpacity>
			       </View>
			   </ImageBackground>;

	  }

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
	<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
		  <View style={styles.ballsview}>
			  	{screen}
		  </View>
      </View>
    </TouchableWithoutFeedback>
    );
  }

  _handleBarCodeRead = ({ type, data }) => {

    fetch('https://appcafe.ru/api2.php?do=adminTransactionStep1&userid='+USERID+'&userPhone='+this.state.phone+'&pass='+this.state.code1+this.state.code2+this.state.code3+this.state.code4+'&transaction='+data)
									      .then((response) => response.json())
									      .then((responseJson) => {



									          if(responseJson[0]=="error")
									          {
										      		alert('Ошибка запроса, попробуйте еще раз!');

									          }
									          else{

										          if(responseJson[0].id && responseJson[0].userid && responseJson[0].tip)
										          {
											           console.log('id:'+responseJson[0].id+' userid'+responseJson[0].userid+' tip:'+responseJson[0].tip+' error:'+responseJson[0]);


														   this.setState({
															   transactionID:data,
															   transactionTYPE:responseJson[0].tip,
															   transactionUID:responseJson[0].userid,
															   transactionBALLS:responseJson[0].balls,
															   qrCodeCamera:false,
															   qrCodeAprove:true,
															   });
												   }
												   else{

												 	  alert('Не действительный QR-код!');
												   }
									          }



									      })
									      .catch((error) => {
									        console.error(error);
								});



  }

}



const styles = StyleSheet.create({
	header: {
		height: 80,
		marginTop: 20,
		backgroundColor: '#000',
		flexDirection: 'row',
		justifyContent: 'space-between'
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
	black: {
	  flex: 1,
	  backgroundColor: '#000',

	},
	ballsview: {
	  flex: 1,
	  backgroundColor: '#000',

	},
	backgroundimgreg: {
		 flex: 1,
        width: undefined,
        height: undefined,

        alignItems: 'center',
	},
	textview: {
		height:200,
		top:20,
		alignItems: 'center',
	},
	textreg: {
		fontSize: 22,
		paddingTop: 5,
		paddingBottom: 5,
		color: '#fff9ee',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	textphone: {
		fontSize: 18,
		marginTop: 25,
		marginBottom: 10,
		color: '#fff9ee',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	phonebox: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		width:220,
		height:50,
		backgroundColor: 'rgba(0,0,0,0)',
		flexDirection:'row',
	},
	leftboxphonecontaner: {
		borderRightWidth: 1,
		borderRightColor: '#fcf5e9',
		flex: 2,
		alignItems: 'center',
		justifyContent:'center',
	},
	rightboxphonecontaner: {
		flex: 7,
		alignItems: 'center',
		justifyContent:'center',
	},
	lefttextphone: {
		color: '#fcf5e9',
		fontSize: 20,
		lineHeight:20,
	},
	righttextphone: {
		color: '#fcf5e9',
		fontSize: 20,
		paddingLeft:10,
		height:40,
		lineHeight:20,
	},
	buttonregbox: {
		width: 220,
		height: 50,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#8d7952',
		backgroundColor: '#8d7952',
		marginTop: 10,
		alignItems: 'center',
		justifyContent:'center',
	},
	buttonreg:{
		color: '#fff9ee',
		fontSize: 16,
		alignItems: 'center',
		justifyContent:'center',
	},
	textsoglasheniebox: {
		width: 220,
		height:200,
		top:20,
	},
	textsoglashenie: {
		fontSize: 14,
		paddingTop: 5,
		color: '#fff9ee',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	hreflink: {
		fontSize: 14,
		paddingBottom: 5,
		color: '#8d7952',
		textDecorationLine: 'underline',
		backgroundColor: 'rgba(0,0,0,0)',
	},

	codeContainer:{
		width: 200,
		height:50,
		flexDirection: 'row',

	},

	textviewCode: {
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 100,
	},
	codebox: {
		width: 30,
		height: 50,
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		backgroundColor: 'rgba(255,255,255,0.2)',

	},
	codeboxtext:{

		fontSize: 20,
		paddingLeft:7,
		height:40,
		lineHeight:20,
		color: '#fff8ed',
	},


	textviewballs: {
		height:200,
		top:50,
		alignItems: 'center',
	},
	textballs: {
		fontSize: 30,
		paddingTop: 5,
		paddingBottom: 5,
		color: '#fff9ee',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	textballsCount: {
		fontSize: 40,
		fontWeight: 'bold',
		paddingTop: 5,
		paddingBottom: 5,
		color: '#fff9ee',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	buttballsbox: {
		width:300,
		height:50,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		backgroundColor: 'rgba(255,255,255,0.1)',
		flexDirection:'row',
	},
	buttballsboxleft: {
		borderRightWidth:1,
		borderColor: '#fcf5e9',
		padding:3,
		width:150,
		alignItems: 'center',
		justifyContent:'center',
	},
	buttballsboxright: {
		padding:3,
		width:150,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignItems: 'center',
		justifyContent:'center',
	},
	buttballsboxlefttext: {
		fontSize:16,
		color: '#fcf5e9',
	},
	buttballsboxrighttext: {
		fontSize:16,
		color: '#fcf5e9',
	},
	ballslc: {
		height:200,
		top:50,
		alignItems: 'center',
		flexDirection:'row',
	},
	ballslctext: {
		fontSize:16,
		color: '#fcf5e9',
	},
	lichniycabinetimg: {
		width: 23,
		height: 27,
		marginRight: 5,
	},
	qrview:{
		marginTop:50,
	},
	textviewqr: {

		top:30,
		alignItems: 'center',
	},
	textqrhead:{
		fontSize:20,
		color: '#fcf5e9',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	buttbackbox: {
		width:150,
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

	aproveview: {
		flex: 1,
		alignItems: 'center',
	},
	summbox: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		width:100,
		height:50,
		backgroundColor: 'rgba(0,0,0,0)',
		flexDirection:'row',
	},
	summbuttongreen: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		width:115,
		height:50,
		marginLeft:10,
		backgroundColor: 'rgba(0,255,0,0.3)',
		flexDirection:'row',
		alignItems: 'center',
		justifyContent:'center',
	},
	summbuttonred: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#fcf5e9',
		width:115,
		height:50,
		marginLeft:10,
		backgroundColor: 'rgba(255,0,0,0.3)',
		flexDirection:'row',
		alignItems: 'center',
		justifyContent:'center',
	},

	summboxtextsumm: {
		flex: 1,
		paddingLeft:10,
		color: '#fcf5e9',
	},
	summrow: {
		width:200,
		height:50,
		flexDirection:'row',
	},
	summcancelbox:{
		height:50,
		marginTop:15,
		backgroundColor: 'rgba(0,0,0,0)',
	},
	summcanceltext: {
		fontSize:18,
		color: '#fcf5e9',
		backgroundColor: 'rgba(0,0,0,0)',
		textDecorationLine: 'underline',
	},
	texttransactionred: {
		fontSize: 22,
		paddingTop: 5,
		paddingBottom: 5,
		color: '#ff0000',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	texttransactiongreen: {
		fontSize: 22,
		paddingTop: 5,
		paddingBottom: 5,
		color: '#00ff00',
		backgroundColor: 'rgba(0,0,0,0)',
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

export default Loyality;
