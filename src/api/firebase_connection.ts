import firestore from "@react-native-firebase/firestore";

export type FirestoreDoc<T> = T & { id: string };

export async function fetchCollection<T>(
collectionPath: string
): Promise<Array<FirestoreDoc<T>>> {
const snapshot = await firestore().collection(collectionPath).get();
return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
}

export async function fetchDocument<T>(
collectionPath: string,
docId: string
): Promise<FirestoreDoc<T> | null> {
const doc = await firestore().collection(collectionPath).doc(docId).get();
if (!doc.exists) return null;
return { id: doc.id, ...(doc.data() as T) };
}

export function subscribeCollection<T>(
collectionPath: string,
onData: (items: Array<FirestoreDoc<T>>) => void,
onError?: (error: unknown) => void
): () => void {
return firestore()
    .collection(collectionPath)
    .onSnapshot(
        (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as T),
            }));
            onData(items);
        },
        (error) => onError?.(error)
    );
}

export function subscribeDocument<T>(
collectionPath: string,
docId: string,
onData: (item: FirestoreDoc<T> | null) => void,
onError?: (error: unknown) => void
): () => void {
return firestore()
    .collection(collectionPath)
    .doc(docId)
    .onSnapshot(
        (doc) => {
            if (!doc.exists) return onData(null);
            onData({ id: doc.id, ...(doc.data() as T) });
        },
        (error) => onError?.(error)
    );
}