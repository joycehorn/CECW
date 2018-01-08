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
import moment from 'moment';
import { width, height } from "react-native-dimension";
import DeviceInfo from "react-native-device-info";
import PropTypes from "prop-types";
import Spinner from 'react-native-spinkit';

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
	backButton: {
		justifyContent: 'center',
		backgroundColor: colors.buttonBackgroundColor,
		borderRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1
	},
	enterButton: {
		height: width(6),
		width: width(30),
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: colors.buttonBackgroundColor,
		borderRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1
	},
	nameButton: {
		flex: 3,
		justifyContent: 'center',
		backgroundColor: colors.textFieldBorderColor,
		borderRadius: 5,
	},
	backButtonText: {
		color: colors.black,
		fontSize: 40,
		textAlign: 'center',
		backgroundColor: colors.transparent
	},
	nameButtonText: {
		color: colors.white,
		fontSize: 50,
		textAlign: 'center',
		backgroundColor: colors.transparent
	},
	firstTabButton: {
		width: width(30),
		justifyContent: 'center',
		backgroundColor: colors.buttonBackgroundColor,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1,
		borderBottomWidth: 0,
	},
	secondTabButton: {
		width: width(20),
		justifyContent: 'center',
		backgroundColor: colors.buttonTintColor,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1,
		borderBottomWidth: 0,
	},
	tabView: {
		flex: 1,
		marginTop: width(5) - 1,
		borderRadius: 5,
		borderTopLeftRadius: 0,
		backgroundColor: colors.buttonBackgroundColor,
		borderWidth: 1,
		borderColor: colors.borderColor,
		padding: width(3),
		paddingTop: width(5),
		paddingBottom: width(5),
	},
	scrollView: {
		flex: 1,
		backgroundColor: colors.white,
		borderRadius: 5,
		borderColor: colors.borderColor,
		borderWidth: 1,
	},
	mainContentView: {
		height: width(5),
		flexDirection: 'row',
		position: 'absolute'
	},
	staticTextView: {
		color: colors.textColor,
		fontSize: 20
	},
	staticTextContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	scrollViewText: {
		color: colors.black,
		fontSize: 22,
		textAlign: 'center',
		backgroundColor: colors.transparent
	},
	scrollViewTempText: {
		paddingLeft: 10,
		height: width(5),
		marginTop: width(5),
		width: width(50),
		marginLeft: width(3),
		position: 'absolute',
		backgroundColor: colors.transparent,
		justifyContent: 'center'
	}
});

const Dashboard = (props) => {
	const { fixingRego, updateState, goBack, logVisit, showVisitModal, checkValidVisitDate, giveWashCard } = props;
	return <View style={styles.container}>
		<View style={{ height: width(12), justifyContent: 'center' }}>
			<Image source={images.logo} style={styles.logoImage} resizeMode="stretch" />
		</View>		
		<View style={{ flex: 1, marginBottom: width(5), marginLeft: width(12.5) }}>
			<View style={{ height: width(12), flexDirection: 'row' }}>
				<View style={{ flex: 3, paddingTop: 10, paddingBottom: 10 }}>
					<View style={styles.staticTextContainer}>
						<Text style={styles.staticTextView}>{props.user === undefined || props.user.firstname === null ? '' : props.user.firstname}</Text>
					</View>
					<View style={styles.staticTextContainer}>
						<Text style={styles.staticTextView}>{props.user === undefined || props.user.lastname === null ? '' : props.user.lastname}</Text>
					</View>
					<View style={styles.staticTextContainer}>
						<Text style={styles.staticTextView}>{props.user === undefined || props.user.email === null ? '' : props.user.email}</Text>
					</View>
					<View style={styles.staticTextContainer}>
						<Text style={styles.staticTextView}>{props.user === undefined || props.user.phone === null ? '' : props.user.phone}</Text>
					</View>
				</View>
				<View style={{ flex: 6, flexDirection: 'row', paddingTop: width(3), paddingBottom: width(3) }}>
					<TouchableOpacity style={styles.nameButton} onPress={fixingRego.bind(this)}>
						<Text style={[styles.nameButtonText, { fontSize: 35 }]}>{props.regoName}</Text>
					</TouchableOpacity>
          <View style={{ width: 20 }}/>
					<TouchableOpacity style={[styles.backButton, { flex: 3 }]} onPress={() => giveWashCard(false)}>
						<Text style={[styles.backButtonText, { fontSize: 30 }]}>Give WashCard</Text>
					</TouchableOpacity>
					<View style={{ width: 20 }}/>
					<TouchableOpacity style={[styles.backButton, { width: 80 }]} onPress={goBack.bind(this)}>
						<Text style={[styles.backButtonText, { fontSize: 30 }]}>Back</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ flex: 1 }}>
				<View style={[styles.tabView, { paddingBottom: props.selectedTab === 1 || props.selectedTab === 2 ? 0 : width(3) }]}>
					<ScrollView style={styles.scrollView}>
						{props.selectedTab === 0 ? props.freeWashHistory.length === 0 ? <View style={{ height: height(100) - width(42) - 40, width: width(81.5) - 60, justifyContent: 'center' }}>
							<Text style={[styles.staticTextView, { fontSize: 40, textAlign: 'center' }]}>{`NO FREE WASH\nHISTORY`}</Text>
						</View> : props.freeWashHistory.map((item, key) => {
							return (
								<TouchableOpacity style={{ height: width(7), flexDirection: 'row', padding: 0 }} onPress={() => 
									{item.usedDate !== null ? alert(`You have used this wash code and can not use it again.\n${moment(item.usedDate).format('l h:mm:ss a')}`) : moment(item.endDate).isBefore(moment()) === true ? showVisitModal(item) : logVisit(item.washcode)}}>
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<Text style={styles.scrollViewText}>{item.washcode}</Text>
								</View>
								<View style={{ flex: 2, justifyContent: 'center' }}>
									<Text style={styles.scrollViewText}>{moment(item.startDate).format('l h:mm:ss a')}</Text>
								</View>
								<View style={{ flex: 2, justifyContent: 'center' }}>
									<Text style={styles.scrollViewText}>{moment(item.endDate).format('l h:mm:ss a')}</Text>
								</View>
								<View style={{ width: width(7), height: width(7), justifyContent: 'center' }}>
									<Image source={item.usedDate !== null ? images.unCheckedMarK : moment(item.endDate).isBefore(moment()) === false ? images.checkedMark : images.hint} style={{ width: width(5), height: width(5), borderRadius: width(2.5) }} resizeMode="cover"></Image>
								</View>
							</TouchableOpacity>
							);
						}) : props.selectedTab === 1 ? props.visitHistory.length === 0 ? <View style={{ height: height(100) - width(54) - 40, width: width(81.5) - 60, justifyContent: 'center' }}>
							<Text style={[styles.staticTextView, { fontSize: 40, textAlign: 'center' }]}>NO VISIT HISTORY</Text>
						</View> : props.visitHistory.map((item, key) => {							
						return (
						<TouchableOpacity style={{ height: width(7), flexDirection: 'row', padding: 0 }}>
							<View style={{ flex: 1, justifyContent: 'center' }}>
								<Text style={[styles.scrollViewText, { textAlign: 'left', marginLeft: 20 }]}>{moment(item.date).format('l h:mm:ss a')}</Text>
							</View>
						</TouchableOpacity>
						);
					}) : props.washCards.length === 0 ? <View style={{ height: height(100) - width(42) - 40, width: width(81.5) - 60, justifyContent: 'center' }}>
              <Text style={[styles.staticTextView, { fontSize: 40, textAlign: 'center' }]}>NO WASH CARDS</Text>
            </View> : props.washCards.map((item, key) => {							
            return (
            <TouchableOpacity style={{ height: width(7), flexDirection: 'row', padding: 0 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={[styles.scrollViewText, { textAlign: 'left', marginLeft: 20 }]}>{item.number}</Text>
              </View>
            </TouchableOpacity>
            );
          })}				
					</ScrollView>
					{props.selectedTab === 1 || props.selectedTab === 2 ? <View style={{ height: width(12), justifyContent: 'center' }}>
						<TouchableOpacity style={styles.enterButton} onPress={() => checkValidVisitDate()}>
							<Text style={styles.backButtonText}>Enter Car Wash</Text>
						</TouchableOpacity>
					</View> : null}
				</View>
				{props.selectedTab === 0 || props.selectedTab === 2 ? null : <View style={styles.scrollViewTempText}>
					<Text style={styles.staticTextView}>{`Last two uses for ${props.regoName}:`}</Text>
				</View>}
				<View style={styles.mainContentView}>
					<TouchableOpacity 
						style={props.selectedTab === 0 ? styles.firstTabButton : [styles.secondTabButton, { width: width(30) }]}
						onPress={() => props.updateState({ selectedTab: 0 })}>
            <Text style={[styles.backButtonText, { fontSize: 35, color: props.selectedTab === 0 ? colors.black : colors.white }]}>
            {`Free Washes ${props.freeWashHistory.length > 0 ? '(' + props.freeWashHistory.length + ')' : ''}`}</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={props.selectedTab !== 1 ? styles.secondTabButton : [styles.firstTabButton, { width: width(20) }]}
						onPress={() => props.updateState({ selectedTab: 1 })}>
						<Text style={[styles.nameButtonText, { fontSize: 35, color: props.selectedTab === 1 ? colors.black : colors.white }]}>
            {`Visits ${props.visitHistory.length > 0 ? '(' + props.visitHistory.length + ')' : ''}`}</Text>
					</TouchableOpacity>
          <TouchableOpacity 
						style={props.selectedTab !== 2 ? [styles.secondTabButton, { width: width(30) }] : [styles.firstTabButton, { width: width(30) }]}
						onPress={() => props.updateState({ selectedTab: 2 })}>
						<Text style={[styles.nameButtonText, { fontSize: 35, color: props.selectedTab === 2 ? colors.black : colors.white }]}>
            {`Wash Cards ${props.washCards.length > 0 ? '(' + props.washCards.length + ')' : ''}`}</Text>
					</TouchableOpacity>
				</View>
			</View>	
		</View>
		{props.isLoading === true ? <View style={{ position: 'absolute', width: width(100), height: height(100), backgroundColor: colors.transparent, left: 0, top: 0, justifyContent: 'center' }}>
			<Spinner style={{ alignSelf: 'center' }} isVisible={props.isLoading} size={100} type="FadingCircleAlt" color={colors.textFieldBorderColor}/>
		</View> : null}
	</View>;
};

Dashboard.propTypes = {
  fixingRego: PropTypes.func.isRequired,
  giveWashCard: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
  logVisit: PropTypes.func.isRequired,
  checkValidVisitDate: PropTypes.func.isRequired,
	updateState: PropTypes.func.isRequired,
	showVisitModal: PropTypes.func.isRequired,
};

export default Dashboard;
