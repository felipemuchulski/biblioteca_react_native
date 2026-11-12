import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList style={styles.tabList}>
        <TabTrigger name="register-user" href="/register-user" asChild>
          <Pressable>
            <Text style={[styles.text, { color: theme.backgroundElement }]}>
              Cadastro
            </Text>
          </Pressable>
        </TabTrigger>
        <TabTrigger name="index" href="/" asChild>
          <Pressable>
            <Text style={[styles.text, { color: theme.backgroundElement }]}>
              Início
            </Text>
          </Pressable>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Spacing.two,
  },
  pressed: { opacity: 0.7 },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
});
