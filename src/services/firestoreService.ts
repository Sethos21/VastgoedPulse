import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Property } from '../types/property';
import { initialProperties } from '../data/initialData';

const PROPERTIES_COLLECTION = 'properties';
const KADASTER_REPORTS_COLLECTION = 'kadaster_reports';

/**
 * Realtime sync with Firestore properties collection.
 * Seeds initial properties if the collection is empty.
 */
export function subscribeToProperties(
  onData: (properties: Property[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PROPERTIES_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (snapshot.empty) {
          // Seed initial properties so database has data
          await seedInitialProperties();
          return;
        }

        const items: Property[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Property);
        });

        onData(items);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PROPERTIES_COLLECTION);
    }
  );
}

/**
 * Seed initial properties into Firestore
 */
export async function seedInitialProperties(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const prop of initialProperties) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, {
        ...prop,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROPERTIES_COLLECTION);
  }
}

/**
 * Save or update a single property in Firestore
 */
export async function savePropertyToFirestore(property: Property): Promise<void> {
  const path = `${PROPERTIES_COLLECTION}/${property.id}`;
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, property.id);
    await setDoc(docRef, {
      ...property,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save multiple scraped properties in bulk
 */
export async function saveScrapedPropertiesToFirestore(properties: Property[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const prop of properties) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, {
        ...prop,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROPERTIES_COLLECTION);
  }
}

/**
 * Save a generated Kadaster report record
 */
export async function saveKadasterReportToFirestore(report: any): Promise<void> {
  const path = `${KADASTER_REPORTS_COLLECTION}/${report.id}`;
  try {
    const docRef = doc(db, KADASTER_REPORTS_COLLECTION, report.id);
    await setDoc(docRef, {
      ...report,
      savedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
