import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import {NativeStackHeaderProps} from "@react-navigation/native-stack";

const PlannerScreen = ({navigation}: NativeStackHeaderProps) => {
  return (
    <View>
      <Text>Planner Screen</Text>
      <Button title="go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

export default PlannerScreen;

const styles = StyleSheet.create({});
