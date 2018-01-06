import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, Image, TouchableOpacity, ScrollView, Animated, Easing} from 'react-native';
import { USERID, IMGPATH } from '../../config/config'

export default class DropdownMenu extends Component {


 	componentDidMount() {
		if(this.props.selectIndexNum){
			this.setState({
	      	  selectIndex: [[this.props.selectIndexNum]],
		  	});
		}
  	}


  constructor(props, context) {
    super(props, context);

    var selectIndex = new Array(this.props.data.length);
    for (var i = 0; i < selectIndex.length; i++) {
      selectIndex[i] = 0;
    }


	     this.state = {
		      activityIndex: -1,
		      selectIndex: selectIndex,
		      rotationAnims: props.data.map(() => new Animated.Value(0))
	    };

    this.defaultConfig = {
      bgColor: 'grey',
      tintColor: 'white',
      selectItemColor: "#f6dab5",
      arrowImg: './img/dropdown_arrow.png',
      checkImage: './img/menu_check.png',
      fontSizep: 20,

    };



  }


  renderChcek(index, title) {
    var activityIndex = this.state.activityIndex;
    if (this.state.selectIndex[activityIndex] == index) {
      var checkImage = this.props.checkImage ? this.props.checkImage : require('./img/menu_check.png');
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}} >
          <Text style={{color: this.props.selectItemColor ? this.props.selectItemColor : this.defaultConfig.selectItemColor, fontSize: this.props.fontSizep ? this.props.fontSizep : this.defaultConfig.fontSizep}} >{title.razdelname}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}} >
          <Text style={{color: '#fff9ef', fontSize: this.props.fontSizep ? this.props.fontSizep : this.defaultConfig.fontSizep}} >{title.razdelname}</Text>
        </View>
      );
    }
  }

  renderActivityPanel() {
    if (this.state.activityIndex >= 0) {

      var currentTitles = this.props.data[this.state.activityIndex];

      var heightStyle = {};
      if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * 44) {
        heightStyle.height = this.props.maxHeight;
      }

      return (
        <View style={{height: this.props.maxHeight, opacity: 0.9, left: 0, right: 0, zIndex:1000, top: 0, bottom: 0}}>
          <TouchableOpacity onPress={() => this.openOrClosePanel(this.state.activityIndex)} activeOpacity={1} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
            <View style={{opacity: 0.4, backgroundColor: 'black', flex: 1 }} />
          </TouchableOpacity>

          <ScrollView style={[{position: 'absolute' ,opacity: 0.9, top: 0, left: 2, right: 2, backgroundColor: 'black', borderColor: '#6f635d', borderWidth: 1, borderRadius: 5}, heightStyle]} >
            {
              currentTitles.map((title, index) =>
                <TouchableOpacity key={index} activeOpacity={1} style={{flex: 1, height: 44}} onPress={this.itemOnPress.bind(this, index)} >
                  {this.renderChcek(index, title[0])}
                  <View style={{backgroundColor: '#6f635d', height: 1}} />
                </TouchableOpacity>
              )
            }
          </ScrollView>
        </View>
      );
    } else {
      return (null);
    }
  }


  openOrClosePanel(index) {

    this.props.bannerAction ? this.props.bannerAction() : null;

    // var toValue = 0.5;
    if (this.state.activityIndex == index) {
      this.closePanel(index);
      this.setState({
        activityIndex: -1,
      });
      // toValue = 0;
    } else {
      if (this.state.activityIndex > -1) {
        this.closePanel(this.state.activityIndex);
      }
      this.openPanel(index);
      this.setState({
        activityIndex: index,
      });
      // toValue = 0.5;
    }
    // Animated.timing(
    //   this.state.rotationAnims[index],
    //   {
    //     toValue: toValue,
    //     duration: 300,
    //     easing: Easing.linear
    //   }
    // ).start();
  }

  openPanel(index) {


    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0.5,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  closePanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  itemOnPress(index) {


    if (this.state.activityIndex > -1) {
      var selectIndex = this.state.selectIndex;
      selectIndex[this.state.activityIndex] = index;
      this.setState({
        selectIndex: selectIndex
      });
      if (this.props.handler) {
        //this.props.handler(this.state.activityIndex, index);

        let razdel_id = this.props.data[this.state.activityIndex][index][0].sort;
        let kolvo_id = this.props.data[this.state.activityIndex][index][0].id;
        let kolvo_kolvo = this.props.data[this.state.activityIndex][index][0].kolvo;
        console.log(razdel_id);

		var updateRazdel  =   this.props.updateRazdel;
		var updateKolvo  =   this.props.updateKolvo;

		if(updateRazdel)updateRazdel(razdel_id);
		if(updateKolvo)updateKolvo(kolvo_id, kolvo_kolvo);
      }
    }
    this.openOrClosePanel(this.state.activityIndex);
  }

  renderDropDownArrow(index) {
    var icon = this.props.arrowImg ? this.props.arrowImg : require('./img/dropdown_arrow.png');

    return (
      <Animated.Image
        source={icon}
        style={{width:6,height:4, marginLeft: 8, transform: [{
          rotateZ: this.state.rotationAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        }]}} />
    );
  }

  render() {

    return (
      <View style={{flexDirection: 'column', flex: 1}} >
        <View style={{flexDirection: 'row', backgroundColor: this.props.bgColor ? this.props.bgColor : this.defaultConfig.bgColor,borderBottomColor:this.props.bgColor,borderBottomWidth:0.5}} >

          {
            this.props.data.map((rows, index) =>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.openOrClosePanel.bind(this, index)}
                key={index}
                style={{flex: 1, height: 40, alignItems: "center", justifyContent: "center"}} >
                <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                  <View style={{flexGrow:1,height:13}}></View>
                  <Text style={{color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor, fontSize: this.props.fontSizep ? this.props.fontSizep : this.defaultConfig.fontSizep}} >{rows[this.state.selectIndex[index]][0].razdelname}</Text>
                  {this.renderDropDownArrow(index)}
                  <View style={{flexGrow:1,height:13}}></View>
                </View>
              </TouchableOpacity>

            )
          }
        </View>
        {this.props.children}

        {this.renderActivityPanel()}

      </View>
    );
  }

}

// this.defaultConfig = {
//       bgColor: 'grey',
//       tintColor: 'white',
//       selectItemColor: "red",
//       arrowImg: './img/dropdown_arrow.png',
//       checkImage: './img/menu_check.png'
//     };
