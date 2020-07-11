import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
//import SignInScreen from './DaraApp/screen/SignInScreen';
import {name as appName} from './app.json';
import {ApplicationContainer} from './DaraApp/ApplicationContainer';

AppRegistry.registerComponent(appName, () => ApplicationContainer);
