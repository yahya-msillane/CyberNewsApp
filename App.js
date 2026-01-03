import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';
import LoginScreen from './src/screens/LoginScreen';

// Import AuthContext
import { AuthProvider, AuthContext } from './Context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator with 4 tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Bookmark') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'CyberNews' }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{ title: 'Discover' }}
      />
      <Tab.Screen 
        name="Bookmark" 
        component={BookmarkScreen}
        options={{ title: 'Bookmarks' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Authentication Navigator (Login Screen)
function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          headerShown: false 
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator that switches between Auth and Main App
function AppNavigator() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    // You can show a loading screen here
    return null; // Or return a LoadingScreen component
  }

  return (
    <NavigationContainer>
      {user ? (
        // User is authenticated - show main app
        <Stack.Navigator>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ArticleDetail" 
            component={ArticleDetailScreen}
            options={{ 
              title: 'Article Details',
              headerStyle: {
                backgroundColor: '#007AFF',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      ) : (
        // User is not authenticated - show login screen
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

// Main App Component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}