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
    alignSelf: "center"
  },
  backButton: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: colors.buttonBackgroundColor,
    borderRadius: 5,
    borderColor: colors.borderColor,
    borderWidth: 1
  },
  backButtonText: {
    color: colors.black,
    fontSize: 40,
    textAlign: "center",
    backgroundColor: colors.transparent
  },
  addRegoButton: {
	height: width(3),
	width: 80,
	alignSelf: 'center',
	justifyContent: 'center',
    backgroundColor: colors.buttonBackgroundColor,
    borderRadius: 5,
    borderColor: colors.borderColor,
    borderWidth: 1
  },
  addRegoButtonText: {
    color: colors.black,
    fontSize: width(1.5),
    textAlign: "center",
    backgroundColor: colors.transparent
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderColor: colors.borderColor,
    borderWidth: 1
  },
  scrollViewText: {
    color: colors.black,
    fontSize: 18,
    backgroundColor: colors.transparent
  }
});

const SearchName = (props) => {
	const { selectRego, updateState, goBack, addRegoButtonTapped } = props;
	return <View style={styles.container}>
		<View style={{ height: width(12), justifyContent: 'center' }}>
			<Image source={images.logo} style={styles.logoImage} resizeMode="stretch" />
		</View>		
    	{!props.addNewRego ? <View style={{ flex: 1, marginBottom: width(5), marginLeft: width(12.5), marginRight: width(12.5) }}>
			<View style={{ height: width(12), flexDirection: 'row' }}>
				<View style={{ flex: 2}}>
				</View>
				<View style={{ flex: 3, flexDirection: 'row', paddingTop: width(2), paddingBottom: width(2) }}>
					<View style={{ flex: 3, marginRight: 20 }}/>
					<TouchableOpacity style={styles.backButton} onPress={goBack.bind(this)}>
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ flex: 1 }}>
				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator indicatorStyle="black">
					{props.users.map((item, key) => {
						return (
						<View>
							<TouchableOpacity style={{ height: width(8), flexDirection: 'row', padding: 0, paddingLeft: 10, paddingRight: 10 }} onPress={() => selectRego(key)}>
								<View style={{ flex: 2 }}>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={styles.scrollViewText}>{item.firstname}</Text>
									</View>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={styles.scrollViewText}>{item.lastname}</Text>
									</View>
								</View>
								<View style={{ flex: 4, justifyContent: 'center' }}>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={styles.scrollViewText}>{item.email}</Text>
									</View>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={styles.scrollViewText}>{item.phone}</Text>
									</View>
								</View>
								<View style={{ flex: 4, justifyContent: 'center' }}>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={styles.scrollViewText}>{props.regoNames[key] !== undefined ? props.regoNames[key].name : ''}</Text>
									</View>
									<View style={{ flex: 1, justifyContent: 'center' }}>
										<TouchableOpacity style={styles.addRegoButton} onPress={() => addRegoButtonTapped(key)}>
											<Text style={styles.addRegoButtonText}>Add Rego</Text>
										</TouchableOpacity>
									</View>
								</View>
							</TouchableOpacity>
							<View style={{ height: 1, backgroundColor: colors.borderColor, marginLeft: 5, marginRight: 5 }}></View>
						</View>
						);
					})}			 
				</ScrollView>
			</View>	
		</View> : null}
		
	</View>;
};

SearchName.propTypes = {
  goBack: PropTypes.func.isRequired,
  selectRego: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  addRegoButtonTapped: PropTypes.func.isRequired
};

export default SearchName;
