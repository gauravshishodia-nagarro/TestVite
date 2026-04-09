import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../components/customText';


export const GlobalOverlay = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <CustomText className="text-white text-lg">User Needs to login to access this feature</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});