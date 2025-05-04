import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#6fc276',
                headerStyle: {
                    backgroundColor: '#25292e'
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                }
            }}
        >
            <Tabs.Screen name="index" options={{
                title: 'Home', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="ingredients" options={{
                title: 'Ingredients', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'cart-sharp' : 'cart-outline'} size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="meals" options={{
                title: 'Meals', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'basket-sharp' : 'basket-outline'} size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="plan" options={{
                title: 'Plan', tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'clipboard-sharp' : 'clipboard-outline'} size={24} color={color} />
                )
            }} />
        </Tabs>
    );
}
