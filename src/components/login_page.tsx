import {
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithCredential,
} from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const GOOGLE_WEB_CLIENT_ID = "61883321928-rld92d49jreei4mtgg10pvcqvfsta32l.apps.googleusercontent.com";
const LOGIN_STORAGE_KEY = "gym_login_credentials";

type StoredLoginCredentials = {
	email?: string;
	password?: string;
	rememberMe?: boolean;
};

function parseStoredCredentials(raw: string | null): StoredLoginCredentials {
	if (!raw) return {};

	try {
		const parsed = JSON.parse(raw) as StoredLoginCredentials;
		if (!parsed || typeof parsed !== "object") return {};
		return {
			email: typeof parsed.email === "string" ? parsed.email : undefined,
			password: typeof parsed.password === "string" ? parsed.password : undefined,
			rememberMe: parsed.rememberMe === true,
		};
	} catch {
		return {};
	}
}

export default function LoginPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	useEffect(() => {
		let active = true;

		const bootstrap = async () => {
			GoogleSignin.configure(
				GOOGLE_WEB_CLIENT_ID
					? { webClientId: GOOGLE_WEB_CLIENT_ID }
					: undefined
			);

			const raw = await AsyncStorage.getItem(LOGIN_STORAGE_KEY);
			const stored = parseStoredCredentials(raw);
			const storedEmail = stored.email ?? "";
			const storedPassword = stored.password ?? "";

			if (!active) return;

			setEmail(storedEmail);
			setRememberMe(stored.rememberMe === true);

			if (!stored.rememberMe || !storedEmail || !storedPassword) {
				setLoading(false);
				return;
			}

			try {
				await signInWithEmailAndPassword(getAuth(), storedEmail, storedPassword);
			} catch (autoLoginError) {
				console.error(autoLoginError);
				setError("Accesso automatico non riuscito. Inserisci la password.");
				setPassword("");
				setRememberMe(false);
				await AsyncStorage.setItem(
					LOGIN_STORAGE_KEY,
					JSON.stringify({ email: storedEmail, rememberMe: false })
				);
			} finally {
				if (active) setLoading(false);
			}
		};

		bootstrap();

		return () => {
			active = false;
		};
	}, []);

	const persistCredentials = async (
		nextEmail: string,
		nextPassword: string,
		nextRememberMe: boolean
	) => {
		if (nextRememberMe) {
			await AsyncStorage.setItem(
				LOGIN_STORAGE_KEY,
				JSON.stringify({
					email: nextEmail,
					password: nextPassword,
					rememberMe: true,
				})
			);
			return;
		}

		await AsyncStorage.setItem(
			LOGIN_STORAGE_KEY,
			JSON.stringify({
				email: nextEmail,
				rememberMe: false,
			})
		);
	};

	const onEmailPasswordPress = async () => {
		setError(null);

		const normalizedEmail = email.trim();
		if (!normalizedEmail || !password) {
			setError("Inserisci email e password.");
			return;
		}

		setLoading(true);

		try {
			await signInWithEmailAndPassword(getAuth(), normalizedEmail, password);
			await persistCredentials(normalizedEmail, password, rememberMe);
		} catch (err) {
			console.error(err);
			setError("Accesso con email/password non riuscito.");
			setPassword("");
			setRememberMe(false);
			await AsyncStorage.setItem(
				LOGIN_STORAGE_KEY,
				JSON.stringify({ email: normalizedEmail, rememberMe: false })
			);
		} finally {
			setLoading(false);
		}
	};

	const onGooglePress = async () => {
		setError(null);
		setLoading(true);

		try {
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
			const signInResult = await GoogleSignin.signIn();

			if (signInResult.type !== "success") {
				setLoading(false);
				return;
			}

			const idToken = signInResult.data.idToken;
			if (!idToken) {
				setError("Configura il Web Client ID Google per completare l'accesso.");
				setLoading(false);
				return;
			}

			const credential = GoogleAuthProvider.credential(idToken);
			await signInWithCredential(getAuth(), credential);
			await AsyncStorage.setItem(
				LOGIN_STORAGE_KEY,
				JSON.stringify({
					email: signInResult.data.user.email,
					rememberMe: false,
				})
			);
		} catch (err) {
			const errorCode = (err as { code?: string })?.code;
			if (errorCode === statusCodes.SIGN_IN_CANCELLED) {
				setLoading(false);
				return;
			}

			console.error(err);
			if (errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				setError("Google Play Services non disponibili su questo dispositivo.");
			} else {
				setError("Accesso con Google non riuscito.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Benvenuto in GYM</Text>
			<Text style={styles.subtitle}>Accedi con email/password o Google.</Text>

			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				placeholder="Email"
				placeholderTextColor="#6F7485"
				autoCapitalize="none"
				keyboardType="email-address"
				autoCorrect={false}
				editable={!loading}
			/>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				placeholderTextColor="#6F7485"
				secureTextEntry
				editable={!loading}
			/>

			<TouchableOpacity
				style={styles.rememberRow}
				onPress={() => setRememberMe((previous) => !previous)}
				disabled={loading}
			>
				<View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
					<Text style={styles.checkboxText}>{rememberMe ? "✓" : ""}</Text>
				</View>
				<Text style={styles.rememberText}>Ricordami</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.loginButton}
				onPress={onEmailPasswordPress}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#FFFFFF" />
				) : (
					<Text style={styles.loginButtonText}>Accedi con email</Text>
				)}
			</TouchableOpacity>

			<Text style={styles.orText}>oppure</Text>

			<TouchableOpacity
				style={styles.loginButton}
				onPress={onGooglePress}
				disabled={loading}
			>
				<Text style={styles.loginButtonText}>Accedi con Google</Text>
			</TouchableOpacity>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
		width: "100%",
		backgroundColor: "#0B0B0F",
	},
	title: {
		fontSize: 26,
		fontWeight: "700",
		color: "#FFFFFF",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 14,
		color: "#B7B7C9",
		marginBottom: 24,
	},
	input: {
		backgroundColor: "#151721",
		width: "100%",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 12,
		marginBottom: 10,
		color: "#FFFFFF",
	},
	rememberRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 16,
	},
	checkbox: {
		width: 22,
		height: 22,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#4C6FFF",
		alignItems: "center",
		justifyContent: "center",
	},
	checkboxChecked: {
		backgroundColor: "#4C6FFF",
	},
	checkboxText: {
		color: "#FFFFFF",
		fontWeight: "700",
	},
	rememberText: {
		color: "#B7B7C9",
	},
	loginButton: {
		backgroundColor: "#4C6FFF",
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderRadius: 14,
		width: "100%",
		alignItems: "center",
	},
	orText: {
		color: "#B7B7C9",
		marginVertical: 10,
	},
	loginButtonText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
	errorText: {
		color: "#FF6B6B",
		marginTop: 16,
	},
});
