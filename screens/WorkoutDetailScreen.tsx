import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {NativeStackHeaderProps} from "@react-navigation/native-stack";
import {useWorkoutBySlug} from "../hooks/useWorkoutBySlug";
import {Modal} from "../components/styled/Modal";
import {PressableText} from "../components/PressableText";
import {formatSec} from "../utils/time";
import {FontAwesome} from "@expo/vector-icons";
import WorkoutItem from "../components/WorkoutItem";
import {SequenceItem} from "../types/data";
import {useCountDown} from "../hooks/useCountDown";

type DetailParams = {
  route: {
    params: {
      slug: string;
    };
  };
};

type Navigation = NativeStackHeaderProps & DetailParams;

const WorkoutDetailScreen = ({route}: Navigation) => {
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [trackerIdx, setTrackerIdx] = useState(-1);
  const workout = useWorkoutBySlug(route.params.slug);

  const {countDown, isRunning, stop, start} = useCountDown(
    trackerIdx,
    trackerIdx >= 0 ? sequence[trackerIdx].duration : -1
  );

  useEffect(() => {
    if (!workout) {
      return;
    }
    if (trackerIdx === workout.sequence.length - 1) {
      return;
    }

    if (countDown === 0) {
      addItemToSequence(trackerIdx + 1);
    }
  }, [countDown]);

  const addItemToSequence = (idx: number) => {
    setSequence([...sequence, workout!.sequence[idx]]);
    setTrackerIdx(idx);
    start();
  };

  if (!workout) {
    return null;
  }

  const hasReachedEnd =
    sequence.length === workout.sequence.length && countDown === 0;

  return (
    <View style={styles.container}>
      <WorkoutItem item={workout}>
        <Modal
          activator={({handleOpen}) => (
            <PressableText onPress={handleOpen} text="Check Sequence" />
          )}
        >
          <View>
            {workout.sequence.map((si, idx) => (
              <View key={si.slug} style={styles.sequenceItem}>
                <Text>
                  {si.name} | {si.type} | {formatSec(si.duration)}
                </Text>
                {idx !== workout.sequence.length - 1 && (
                  <FontAwesome name="arrow-down" size={20} />
                )}
              </View>
            ))}
          </View>
        </Modal>
      </WorkoutItem>
      <View>
        {sequence.length === 0 && (
          <FontAwesome
            name="play-circle-o"
            size={100}
            onPress={() => addItemToSequence(0)}
          />
        )}
        {sequence.length > 0 && countDown >= 0 && (
          <View>
            <Text style={{fontSize: 55}}>{countDown}</Text>
          </View>
        )}
      </View>
      <View style={{alignItems: "center"}}>
        <Text style={{fontSize: 60, fontWeight: "bold"}}>
          {sequence.length === 0
            ? "Prepare"
            : hasReachedEnd
            ? "Great Job!"
            : sequence[trackerIdx].name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  sequenceItem: {
    alignItems: "center",
  },
  centerView: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
});
export default WorkoutDetailScreen;
