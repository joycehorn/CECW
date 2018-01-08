import React from "react";
import {
	Image,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
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
		width: width(25),
		height: width(15),
		alignSelf: 'center',
		backgroundColor: colors.buttonBackgroundColor,
		borderWidth: 1,
		borderColor: colors.borderColor, 
		justifyContent: 'center'
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 50,
		backgroundColor: colors.transparent,
		fontWeight: '500'
	}
});

const Splash = (props) => {
	const { startAction } = props;
	
	return <View style={styles.container}>
		<View style={{ height: width(12), justifyContent: 'center' }}>
			<Image source={images.logo} style={styles.logoImage} resizeMode="stretch" />
		</View>		
		<View style={{ flex: 1, justifyContent: 'center', marginBottom: width(12) }}>
			<TouchableOpacity style={styles.startButton} onPress={startAction.bind(this)}>
				<Text style={styles.buttonText}>Start</Text>
			</TouchableOpacity>
		</View>
	</View>;
};

Splash.propTypes = {
	startAction: PropTypes.func.isRequired,
};

export default Splash;
