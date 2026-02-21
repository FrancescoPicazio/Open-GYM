import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Alert,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Esercizio, Serie } from "../types/workout";
import {
	getForegroundTimerState,
	startForegroundTimer,
	subscribeForegroundTimerEvents,
} from "../api/foreground_timer";

type ExerciseCardProps = {
	exercise: Esercizio;
	onPress: () => void;
	onToggleDone: () => void;
};

type ExerciseDetailProps = {
	dayLabel: string;
	exercise: Esercizio;
	onBack: () => void;
	onChange: (exercise: Esercizio) => void;
	onToggleDone: () => void;
};

function parseMaybeNumber(value: string): number | string | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const numericValue = Number(trimmed);
	return Number.isNaN(numericValue) ? trimmed : numericValue;
}

function parseWeight(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const numericValue = Number(trimmed);
	return Number.isNaN(numericValue) ? null : numericValue;
}

export function ExerciseCard({
	exercise,
	onPress,
	onToggleDone,
}: Readonly<ExerciseCardProps>) {
	const totalSeries = exercise.serie?.length ?? 0;
	const image = exercise.immagine ? { uri: exercise.immagine } : null;
	const doneSeries = (exercise.serie ?? []).filter((serie) => serie.done).length;
	return (
		<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
				<View style={styles.cardHeader}>
					{image ? (
						<View style={styles.exerciseImageWrapper}>
							<Image source={image} style={styles.exerciseImage} resizeMode="contain" />
						</View>
					) : null}
					<View style={styles.cardTitleRow}>
						<Text style={styles.cardTitle}>{exercise.nome}</Text>
						<TouchableOpacity
							style={[styles.checkbox, exercise.done && styles.checkboxDone]}
							onPress={onToggleDone}
						>
							<Text style={styles.checkboxText}>{exercise.done ? "✓" : ""}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Text style={styles.cardMeta}>{totalSeries} serie</Text>
				<Text style={styles.cardMeta}>Completate: {doneSeries}/{totalSeries}</Text>
				{exercise.note ? <Text style={styles.cardNote}>{exercise.note}</Text> : null}
		</TouchableOpacity>
	);
}

export function ExerciseDetail({
	dayLabel,
	exercise,
	onBack,
	onChange,
	onToggleDone,
}: Readonly<ExerciseDetailProps>) {
	const [draft, setDraft] = useState<Esercizio>(exercise);
	const draftRef = useRef<Esercizio>(exercise);
	const [seriesTimers, setSeriesTimers] = useState<
		Record<number, { endAt: number | null; remaining: number | null; completed: boolean }>
	>({});
	const image = exercise.immagine ? { uri: exercise.immagine } : null;
	const activeSeriesTimerRef = useRef<number | null>(null);


	useEffect(() => {
		setDraft(exercise);
		draftRef.current = exercise;
		const initialTimers: Record<
			number,
			{ endAt: number | null; remaining: number | null; completed: boolean }
		> = {};
		exercise.serie.forEach((serie, index) => {
			if (serie.done) {
				initialTimers[index] = {
					endAt: null,
					remaining: null,
					completed: true,
				};
			}
		});
		setSeriesTimers(initialTimers);
		activeSeriesTimerRef.current = null;
	}, [exercise]);

	useEffect(() => {
		draftRef.current = draft;
	}, [draft]);

	const applyDraft = useCallback((updater: (previous: Esercizio) => Esercizio) => {
		setDraft((previous) => {
			const next = updater(previous);
			draftRef.current = next;
			return next;
		});
	}, []);

	const markSeriesDoneAndCommit = useCallback((seriesIndex: number) => {
		let nextExercise: Esercizio | null = null;

		applyDraft((previous) => {
			const nextSeries = previous.serie.map((serie, index) =>
				index === seriesIndex ? { ...serie, done: true } : serie
			);
			const allDone = nextSeries.length > 0 && nextSeries.every((serie) => serie.done);
			nextExercise = {
				...previous,
				serie: nextSeries,
				done: allDone,
			};
			return nextExercise;
		});

		if (nextExercise) {
			onChange(nextExercise);
		}
	}, [applyDraft, onChange]);

	const updateSeries = (index: number, nextSerie: Serie) => {
		applyDraft((previous) => ({
			...previous,
			serie: previous.serie.map((serie, serieIndex) =>
				serieIndex === index ? nextSerie : serie
			),
		}));


	};

	const commitLatest = () => {
		onChange(draftRef.current);
	};

	useEffect(() => {
		const subscription = subscribeForegroundTimerEvents((event) => {
			const activeSeriesIndex = activeSeriesTimerRef.current;
			if (activeSeriesIndex === null) return;

			if (event.status === "running" && typeof event.remainingSeconds === "number") {
				const remainingSeconds = event.remainingSeconds;
				setSeriesTimers((prev) => ({
					...prev,
					[activeSeriesIndex]: {
						endAt: null,
						remaining: remainingSeconds,
						completed: false,
					},
				}));
				return;
			}

			if (event.status === "finished") {
				setSeriesTimers((prev) => ({
					...prev,
					[activeSeriesIndex]: {
						endAt: null,
						remaining: null,
						completed: true,
					},
				}));
				markSeriesDoneAndCommit(activeSeriesIndex);
				activeSeriesTimerRef.current = null;
				return;
			}

			if (event.status === "stopped") {
				setSeriesTimers((prev) => ({
					...prev,
					[activeSeriesIndex]: {
						endAt: null,
						remaining: null,
						completed: false,
					},
				}));
				activeSeriesTimerRef.current = null;
			}
		});

		getForegroundTimerState().catch(() => {
		});

		return () => {
			subscription.remove();
		};
	}, [markSeriesDoneAndCommit]);

	const startSeriesTimer = async (serieIndex: number, recoverySeconds: number) => {
		if (recoverySeconds <= 0) return;

		const applyStartedState = () => {
			activeSeriesTimerRef.current = serieIndex;
			setSeriesTimers((prev) => ({
				...prev,
				[serieIndex]: { endAt: null, remaining: recoverySeconds, completed: false },
			}));
		};

		const replaceExistingTimer = () => {
			(async () => {
				try {
					await startForegroundTimer(`Serie #${serieIndex + 1}`, recoverySeconds, true);
					applyStartedState();
				} catch {
					Alert.alert("Errore timer", "Impossibile avviare il nuovo timer.");
				}
			})();
		};

		try {
			await startForegroundTimer(`Serie #${serieIndex + 1}`, recoverySeconds);
			applyStartedState();
		} catch (error: any) {
			if (String(error?.code ?? "") === "TIMER_ALREADY_RUNNING") {
				Alert.alert(
					"Timer attivo",
					"C'è già un timer in esecuzione.",
					[
						{ text: "Annulla", style: "cancel" },
						{
							text: "Cancella vecchio timer",
							style: "destructive",
							onPress: replaceExistingTimer,
						},
					],
				);
				return;
			}

			Alert.alert("Errore timer", "Impossibile avviare il timer.");
		}
	};

	return (
		<View style={styles.detailContainer}>
			<View style={styles.detailHeader}>
				<TouchableOpacity onPress={onBack}>
					<Text style={styles.linkText}>Indietro</Text>
				</TouchableOpacity>
				<View style={styles.detailHeaderRight}>
					<Text style={styles.detailTitle}>{dayLabel}</Text>
					<TouchableOpacity
						style={[styles.checkbox, draft.done && styles.checkboxDone]}
						onPress={onToggleDone}
					>
						<Text style={styles.checkboxText}>{draft.done ? "✓" : ""}</Text>
					</TouchableOpacity>
				</View>
			</View>

			<Text style={styles.detailExerciseName}>{draft.nome}</Text>
			{image && <Image source={image} style={styles.exerciceImageDetail}  />}

			<View style={styles.sectionBlock}>
				<Text style={styles.sectionTitle}>Serie</Text>
				{draft.serie.map((serie, index) => {
					const timerState = seriesTimers[index];
					const hasRunningTimer = timerState?.remaining !== null && timerState?.remaining !== undefined;
					const recoverySecondsRaw = Number(serie.recupero);
					const hasSeriesRecovery = Number.isFinite(recoverySecondsRaw) && recoverySecondsRaw > 0;
					const recoverySeconds = hasSeriesRecovery ? recoverySecondsRaw : 0;
					let timerLabel = hasSeriesRecovery ? `Timer ${recoverySeconds}s` : "Timer";

					if (hasRunningTimer) {
						timerLabel = `${timerState.remaining}s`;
					} else if (timerState?.completed || serie.done) {
						timerLabel = "Fatta ✓";
					}

					return (
						<View key={`${draft.nome}-${index}`} style={styles.serieRow}>
							<Text style={styles.serieLabel}>#{index + 1}</Text>
							<TextInput
								style={styles.serieInput}
								value={serie.ripetizioni ? String(serie.ripetizioni) : ""}
								placeholder="Ripetizioni"
								placeholderTextColor="#6F7485"
								keyboardType="numeric"
								onChangeText={(value) =>
									updateSeries(index, {
										...serie,
										ripetizioni: parseMaybeNumber(value),
									})
								}
								onEndEditing={commitLatest}
							/>

							<TextInput
								style={[styles.serieInput, styles.recoveryInput]}
								value={serie.recupero !== null && serie.recupero !== undefined ? String(serie.recupero) : ""}
								placeholder="Rec s"
								placeholderTextColor="#6F7485"
								keyboardType="numeric"
								onChangeText={(value) =>
									updateSeries(index, {
										...serie,
										recupero: parseMaybeNumber(value),
									})
								}
								onEndEditing={commitLatest}
							/>

							<TextInput
								style={styles.serieInput}
								value={serie.carico !== null && serie.carico !== undefined ? String(serie.carico) : ""}
								placeholder="Carico"
								placeholderTextColor="#6F7485"
								keyboardType="numeric"
								onChangeText={(value) =>
									updateSeries(index, {
										...serie,
										carico: parseWeight(value),
									})
								}
								onEndEditing={commitLatest}
							/>

														<TouchableOpacity
															style={[
																styles.serieTimerButton,
																hasRunningTimer && styles.serieTimerButtonRunning,
																(timerState?.completed || serie.done) && styles.serieTimerButtonDone,
																!hasSeriesRecovery && styles.serieTimerButtonDisabled,
															]}
															onPress={() => startSeriesTimer(index, recoverySeconds)}
															disabled={!hasSeriesRecovery}
														>
															<Text style={styles.serieTimerButtonText}>{timerLabel}</Text>
														</TouchableOpacity>
						</View>
					);
				})}
			</View>

			<View style={styles.sectionBlock}>
				<Text style={styles.sectionTitle}>Note</Text>
				<TextInput
					style={[styles.input, styles.multilineInput]}
					value={draft.note ?? ""}
					placeholder="Aggiungi note"
					placeholderTextColor="#6F7485"
					multiline
					onChangeText={(value) => applyDraft((prev) => ({ ...prev, note: value }))}
					onEndEditing={commitLatest}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 16,
		borderRadius: 16,
		backgroundColor: "#151721",
		gap: 6,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		flex: 1,
	},
	cardTitle: {
		color: "#FFFFFF",
		fontWeight: "700",
		fontSize: 16,
		flex: 1,
	},
	cardMeta: {
		color: "#B7B7C9",
		marginTop: 4,
	},
	exerciseImageWrapper: {
		marginRight: 12,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
	},
	exerciseImage: {
		width: 50,
		height: 50,
		borderRadius: 10,
	},
	// imposto nel dettaglio una dimensione maggiore per poterla vedere meglio, ma magari va rivista in generale
	exerciceImageDetail: {
		width: 250,
		height: 250,
		alignSelf: "center",
	},
	cardNote: {
		color: "#9AA3B2",
		fontStyle: "italic",
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#4C6FFF",
		alignItems: "center",
		justifyContent: "center",
	},
	checkboxDone: {
		backgroundColor: "#4C6FFF",
	},
	checkboxText: {
		color: "#FFFFFF",
		fontWeight: "700",
	},
	detailContainer: {
		backgroundColor: "#151721",
		padding: 16,
		borderRadius: 18,
		gap: 16,
	},
	detailHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	detailHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	linkText: {
		color: "#8EC5FC",
		fontWeight: "600",
	},
	detailTitle: {
		color: "#FFFFFF",
		fontWeight: "700",
	},
	detailExerciseName: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "700",
	},
	sectionBlock: {
		gap: 10,
	},
	sectionTitle: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
	input: {
		backgroundColor: "#0B0B0F",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: "#FFFFFF",
	},
	multilineInput: {
		minHeight: 90,
		textAlignVertical: "top",
	},
	serieRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	serieLabel: {
		color: "#B7B7C9",
		width: 28,
	},
	serieInput: {
		flex: 1,
		backgroundColor: "#0B0B0F",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		color: "#FFFFFF",
	},
	recoveryInput: {
		maxWidth: 84,
	},
	serieTimerButton: {
		backgroundColor: "#4C6FFF",
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 10,
		minWidth: 86,
		alignItems: "center",
	},
	serieTimerButtonRunning: {
		backgroundColor: "#8EC5FC",
	},
	serieTimerButtonDone: {
		backgroundColor: "#2E8B57",
	},
	serieTimerButtonDisabled: {
		opacity: 0.45,
	},
	serieTimerButtonText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
});
