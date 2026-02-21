import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type GymCardProps = {
	title: string;
	subtitle?: string;
	selected?: boolean;
	onPress: () => void;
};

export default function GymCard({
	title,
	subtitle,
	selected,
	onPress,
}: Readonly<GymCardProps>) {
	return (
		<TouchableOpacity
			style={[styles.card, selected && styles.cardSelected]}
			onPress={onPress}
		>
			<View style={styles.cardContent}>
				<Text style={styles.cardTitle}>{title}</Text>
				{subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		minWidth: 110,
		padding: 14,
		borderRadius: 16,
		backgroundColor: "#151721",
		borderWidth: 1,
		borderColor: "transparent",
	},
	cardSelected: {
		borderColor: "#4C6FFF",
		backgroundColor: "#1C2140",
	},
	cardContent: {
		gap: 4,
	},
	cardTitle: {
		color: "#FFFFFF",
		fontWeight: "700",
	},
	cardSubtitle: {
		color: "#B7B7C9",
		fontSize: 12,
	},
});
