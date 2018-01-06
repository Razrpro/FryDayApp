import React from 'react';
import { TabNavigator, StackNavigator, DrawerNavigator, Icon } from 'react-navigation';

import Feed from '../screens/Feed';
import Settings from '../screens/Settings';
import Loyality from '../screens/Loyality';
import UserDetail from '../screens/UserDetail';
import Me from '../screens/Me';
import About from '../screens/About';
import Contacts from '../screens/Contacts';
import Cart from '../screens/Cart';
import Oformlenie from '../screens/Oformlenie';


export const MyDrawerNavigator = DrawerNavigator({
	Feed: { screen: Feed },
	Details: { screen: UserDetail}
});

export const FeedStack = StackNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: {
      title: 'Наше меню',
    },
  },
  Details: {
    screen: UserDetail,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name.toUpperCase()}`,
    }),
  }
  }, {
  headerMode: 'none',

});

/*export const Tabs = TabNavigator({
  Feed: {
    screen: FeedStack,
    navigationOptions: {

      tabBarLabel: 'Feed',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
    },
  },
  Me: {
    screen: Me,
    navigationOptions: {
      tabBarLabel: 'Me',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={35} color={tintColor} />
    },
  },
});
*/



export const LoyalityStack = StackNavigator({
  Loyality: {
    screen: Loyality,
    navigationOptions: {
      title: 'Программа лояльности',
    },
  }
  },
  {
  	headerMode: 'none',
});

export const AboutStack = StackNavigator({
  About: {
    screen: About,
    navigationOptions: {
      title: 'О ресторане',
    },
  }
  },
  {
  	headerMode: 'none',
});


export const ContactsStack = StackNavigator({
  Contacts: {
    screen: Contacts,
    navigationOptions: {
      title: 'Контакты',
    },
  }
  },
  {
  	headerMode: 'none',
});



export const CartStack = StackNavigator({
  Cart: {
    screen: Cart,
    navigationOptions: {
      title: 'Корзина товаров',
    },
  },
  Oformlenie: {
    screen: Oformlenie,
    navigationOptions: ({ navigation }) => ({
      title: `Оформление заказа`,
    }),
  }
  },
  {
  	headerMode: 'none',
});



export const Root = DrawerNavigator({
   Feed: {
    screen: FeedStack,
    navigationOptions: {

      tabBarLabel: 'Feed',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
    },
  },
  Cart: {
    screen: CartStack,
  },
  Loyality: {
    screen: LoyalityStack,
  },
  About: {
    screen: AboutStack,
  },
  Contacts: {
    screen: ContactsStack,
  },
}, {
  mode: 'modal',
  headerMode: 'screen',
  contentOptions: {

	   inactiveTintColor: '#ffffff',
	   activeBackgroundColor: 'rgba(100,100,100,1)',
	   activeTintColor: '#ffffff',
		 itemsContainerStyle: {
		 	paddingTop: 30,
		 },
  },

  drawerBackgroundColor: 'rgba(0,0,0,0.7)',
});
