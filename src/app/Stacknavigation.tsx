import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Forgotpassword from '../screens/Forgotpassword';
import Login from '../screens/Login';
import Register from '../screens/Register';
import SOSHistoryScreen from '../screens/SOSHistoryScreen';
import SplashScreen from '../screens/SplashScreen';
import Tabnavigation from './Tabnavigation'; // create this file next

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} ></Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={Forgotpassword} ></Stack.Screen>
      <Stack.Screen name="MainApp" component={ Tabnavigation} />
       <Stack.Screen name="SOSHistory" component={SOSHistoryScreen} />
    </Stack.Navigator>
      );
}
