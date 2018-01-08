import React from "react";
import {
	Image,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Button } from "react-native-elements";
import { width, height } from "react-native-dimension";
import DeviceInfo from "react-native-device-info";
import PropTypes from "prop-types";
import { colors } from "../../config/styles";
import images from "../../config/images";

const styles = StyleSheet.create({
	container: {
		height: Platform.OS === "android" ? height(100) - 20 : height(100),
		backgroundColor: colors.white,
		padding: 20
	},
	logoImage: {
		width: width(75),
		height: width(12),
		alignSelf: 'center',
	},
	startButton: {
		width: width(65),
    height: width(8),
    marginTop: 10,
		alignSelf: 'center',
		backgroundColor: colors.buttonBackgroundColor,
		borderWidth: 1,
		borderColor: colors.borderColor, 
		justifyContent: 'center'
	},
	nameField: {
		backgroundColor: colors.white,
		padding: 20,
		fontSize: 50,
		textAlign: 'center',
		borderWidth: 1,
		borderColor: colors.textFieldBorderColor, 
		justifyContent: 'center'
	},
	contentView: {
		width: width(65),
		height: width(58) + 20,
		alignSelf: 'center',
		backgroundColor: colors.buttonBackgroundColor,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 50,
		backgroundColor: colors.transparent,
		fontWeight: '500'
  },
  numberButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: colors.buttonBackgroundColor,
    borderWidth: 1,
    justifyContent: 'center',
    aspectRatio: 1
  },
  backSpaceButton: {
    marginRight: width(2) + 0.5,
    width: width(15.5) - 8,
    borderRadius: 5,
    backgroundColor: colors.buttonBackgroundColor,
    borderWidth: 1,
    justifyContent: 'center'
  }
});

const LogIn = (props) => {
	const { loginButtonTapped, updateState, addRegoButtonTapped } = props;
	
	return <View style={styles.container}>
		<View style={{ height: width(12), justifyContent: 'center' }}>
			<Image source={images.logo} style={styles.logoImage} resizeMode="stretch" />
		</View>		
		<View style={{ flex: 1, marginTop: 10 }}>
			<View style={styles.contentView}>
        {props.addNewVisible ? <View style={{ height: 40 }}>
          <Text style={[styles.buttonText, { fontSize: 35 }]}>No Results</Text>
        </View> : null}
        <TouchableWithoutFeedback style={{width: width(65), height: width(8), alignSelf: 'center', marginTop: 10 }} onPress={() => {Keyboard.dismiss(); updateState({ selectedField: 0 })}} accessible={false}>
          <View style={{ width: width(65), height: width(8), alignSelf: 'center' }}>
            <TextInput
              onFocus={() => {Keyboard.dismiss(); updateState({ selectedField: 0 })}}
              value={props.identifier}
							pointerEvents="none"
							placeholder="rego"
              onChangeText={(text) => updateState({ identifier: text })}
              style={[styles.nameField, { borderWidth: props.selectedField === 0 ? 5 : 1 }]}
              autoCapitalize="none"
              underlineColorAndroid="#00000000">
            </TextInput>
          </View>
        </TouchableWithoutFeedback>
        {props.addNewVisible ? <TouchableWithoutFeedback style={{ marginTop: 10, width: width(65), height: width(8), alignSelf: 'center'}} onPress={() => {Keyboard.dismiss(); updateState({ selectedField: 1 })}} accessible={false}>
          <View style={{ marginTop: 10,width: width(65), height: width(8), alignSelf: 'center' }}>
            <TextInput
              onFocus={() => {Keyboard.dismiss(); updateState({ selectedField: 1 })}}
              value={props.email}
							pointerEvents="none"
							placeholder="email"
              onChangeText={(text) => updateState({ email: text })}
              style={[styles.nameField, { borderWidth: props.selectedField === 1 ? 5 : 1 }]}
              autoCapitalize="none"
              underlineColorAndroid="#00000000">
            </TextInput>
          </View>
        </TouchableWithoutFeedback> : null}
        <View style={{ height: width(28), width: width(65) }}>
          
        </View>
        {!props.addNewVisible ? <TouchableOpacity style={styles.startButton} onPress={loginButtonTapped.bind(this)}>
					<Text style={styles.buttonText}>Go</Text>
				</TouchableOpacity> : null}
				
        {props.addNewVisible ? <TouchableOpacity style={styles.startButton} onPress={() => addRegoButtonTapped(false)}>
					<Text style={styles.buttonText}>Add Rego</Text>
				</TouchableOpacity> : null}
        
			</View>			
		</View>
	</View>;
};

LogIn.propTypes = {
	loginButtonTapped: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  addRegoButtonTapped: PropTypes.func.isRequired
};

export default LogIn;
