import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodaysQuestScreen from '../clavvupScreens/TodaysQuestScreen';
import ClawScreen from '../clavvupScreens/ClawScreen';
import StoriesScreen from '../clavvupScreens/StoriesScreen';
import StoryDetailScreen from '../clavvupScreens/StoryDetailScreen';
import SettingsScreen from '../clavvupScreens/SettingsScreen';
import { TAB_ICONS } from '../clavvupConstants/Images';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ icon, activeIcon, focused }: { icon: any; activeIcon: any; focused: boolean }) {
  return (
    <Image
      source={focused ? activeIcon : icon}
      style={styles.tabIcon}
      resizeMode="contain"
    />
  );
}

function StoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoriesList" component={StoriesScreen} />
      <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#6B46C1',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#FFD700',
            marginHorizontal: 16,
            marginBottom: 20,
            position: 'absolute',
            elevation: 10,
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#fff',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodaysQuestScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={TAB_ICONS.home}
                activeIcon={TAB_ICONS.homeActive}
                focused={focused}
              />
            ),
            tabBarLabel: "",
          }}
        />
        <Tab.Screen
          name="Claw"
          component={ClawScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={TAB_ICONS.claw}
                activeIcon={TAB_ICONS.clawActive}
                focused={focused}
              />
            ),
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Stories"
          component={StoriesStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={TAB_ICONS.stories}
                activeIcon={TAB_ICONS.storiesActive}
                focused={focused}
              />
            ),
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={TAB_ICONS.settings}
                activeIcon={TAB_ICONS.settingsActive}
                focused={focused}
              />
            ),
            tabBarLabel: '',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});
