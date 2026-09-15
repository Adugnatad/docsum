import { Tabs, router } from "expo-router";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  Timer as TimerIcon,
  LibraryBig,
  BarChart3,
  FileUp,
  SlidersHorizontal,
  History,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react-native";

const navItems = [
  { route: "/", label: "Upload", icon: FileUp },
  { route: "/process", label: "Process", icon: SlidersHorizontal },
  { route: "/history", label: "History", icon: History },
  { route: "/summary", label: "Summary", icon: BarChart3 },
];

export default function TabsLayout() {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              header: () => (
                <View className="flex-row items-center gap-2 ml-[20px]">
                  <Text className="text-[#2235bd] text-2xl font-bold ml-4">
                    DocSum
                  </Text>
                </View>
              ),
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="process"
            options={{
              header: () => (
                <View className="flex-row items-center gap-2 ml-[20px]">
                  <ArrowLeft
                    size={24}
                    color="#2235bd"
                    onPress={() => router.back()}
                  />
                  <Text className="text-[#2235bd] text-2xl font-bold ml-4">
                    DocSum
                  </Text>
                </View>
              ),
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              header: () => (
                <View className="flex-row items-center gap-2 ml-[20px]">
                  <ArrowLeft
                    size={24}
                    color="#2235bd"
                    onPress={() => router.back()}
                  />
                  <Text className="text-[#2235bd] text-2xl font-bold ml-4">
                    DocSum
                  </Text>
                </View>
              ),
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="summary"
            options={{
              header: () => (
                <View className="flex-row items-center gap-2 ml-[20px]">
                  <ArrowLeft
                    size={24}
                    color="#2235bd"
                    onPress={() => router.back()}
                  />
                  <Text className="text-[#2235bd] text-2xl font-bold ml-4">
                    Your Summary
                  </Text>
                </View>
              ),
              headerShown: true,
            }}
          />
        </Tabs>
      </View>

      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            item.route !== "/summary" && (
              <Pressable
                key={item.route}
                onPress={() => router.push(item.route)}
                style={[styles.bottomNavItem]}
              >
                <Icon size={24} color="#A8A29E" />
                <Text style={styles.bottomNavLabel}>{item.label}</Text>
              </Pressable>
            )
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fbf9f8",
  },
  header: {
    backgroundColor: "rgba(250, 250, 249, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#E7E5E4",
    zIndex: 20,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 16 : 12,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1917",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "Manrope" : "sans-serif",
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(250, 250, 249, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#E7E5E4",
  },
  bottomNavItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bottomNavItemActive: {
    backgroundColor: "rgba(71, 101, 80, 0.1)",
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
    color: "#A8A29E",
  },
  bottomNavLabelActive: {
    color: "#476550",
  },
});
