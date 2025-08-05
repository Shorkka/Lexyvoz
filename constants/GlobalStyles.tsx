import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12,
      padding: 10,
      height: 150,
      borderRadius: 12,
      backgroundColor: "#ffb525",
      marginBottom: 20,
    },
    avatarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#ffb525",
      borderRadius: 999, 
      height: 96,
      width: 96,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 16,
      marginTop: 20,
      marginBottom: 10,
      color: '#fff',
    },
    menuItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuItemText: {
      marginLeft: 10,
      fontSize: 14,
    },
    divider: {
      height: 1,
      backgroundColor: 'grey',
      marginHorizontal: 16,
      marginVertical: 8,
    },
    logoutButton: {
      marginTop: 'auto',
      marginBottom: 30,
      marginHorizontal: 16,
    },

})

export default styles;