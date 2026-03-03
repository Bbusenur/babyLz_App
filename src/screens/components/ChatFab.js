import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

const ChatFab = ({ onPress }) => {
    const theme = useTheme();

    return (
        <View style={styles.container} pointerEvents="box-none">
            <IconButton
                icon="message-text-outline"
                size={26}
                mode="contained"
                onPress={onPress}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                iconColor="#fff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 16,
        bottom: 90, // tab bar'ın biraz üstü
    },
    button: {
        elevation: 4,
    },
});

export default ChatFab;

