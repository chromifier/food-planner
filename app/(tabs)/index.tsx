import { Link } from "expo-router";
import { StyleSheet, Text, View, StatusBar } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#25292e" />
      <Text style={styles.textHeader}>Welcome to the Home page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  textHeader: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6fc276',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  }
});