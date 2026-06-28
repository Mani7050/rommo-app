import { doc, setDoc, collection, getDocs } from "firebase/firestore"
import { db, firebaseConfig } from "./firebase"

// Helper to check if Firebase is configured with real keys
const isFirebaseConfigured = () => {
  return (
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "dummy-project-id" &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "dummy-api-key-for-local-development"
  )
}

// Initial seed data
const DEFAULT_WORKSPACES = [
  { id: "d1", title: "Luxury Penthouse Suite", location: "Lavelle Road, Bangalore", price: 5499, image: "/comfort_room.png", rating: 4.9, type: "Suite", reviews: 48, status: "Available" },
  { id: "d2", title: "Creative Focus Cabin", location: "HSR Layout, Bangalore", price: 650, image: "/meeting_room.png", rating: 4.7, type: "Workspace", reviews: 112, status: "Available" },
  { id: "d3", title: "Greenery Studio Apartment", location: "Koramangala, Bangalore", price: 1899, image: "/urban_studio.png", rating: 4.8, type: "Room", reviews: 89, status: "Available" },
  { id: "d4", title: "Executive Boardroom", location: "Indiranagar, Bangalore", price: 1500, image: "/meeting_room.png", rating: 4.6, type: "Workspace", reviews: 34, status: "Maintenance" },
  { id: "d5", title: "Bachelor Monthly Room", location: "Koramangala, Bangalore", price: 14500, image: "/urban_studio.png", rating: 4.5, type: "Monthly", reviews: 67, status: "Available" }
]

// 1. WORKSPACES
export async function getWorkspaces(): Promise<any[]> {
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDocs(collection(db, "workspaces"))
      if (!snap.empty) {
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
    } catch (err) {
      console.warn("Failed fetching workspaces from Firestore, falling back to local:", err)
    }
  }

  // Fallback to local storage
  const local = localStorage.getItem("rommo_workspaces")
  if (local) {
    return JSON.parse(local)
  }
  localStorage.setItem("rommo_workspaces", JSON.stringify(DEFAULT_WORKSPACES))
  return DEFAULT_WORKSPACES
}

export async function saveWorkspaces(list: any[]): Promise<void> {
  if (isFirebaseConfigured()) {
    try {
      // Sync each one to Firestore
      for (const item of list) {
        await setDoc(doc(db, "workspaces", item.id), item)
      }
      return
    } catch (err) {
      console.warn("Failed saving workspaces to Firestore, falling back to local:", err)
    }
  }
  localStorage.setItem("rommo_workspaces", JSON.stringify(list))
}

export async function saveWorkspaceSingle(workspace: any): Promise<void> {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, "workspaces", workspace.id), workspace)
      return
    } catch (err) {
      console.warn("Failed saving workspace to Firestore, falling back to local:", err)
    }
  }
  const current = await getWorkspaces()
  const idx = current.findIndex(w => w.id === workspace.id)
  if (idx > -1) {
    current[idx] = workspace
  } else {
    current.unshift(workspace)
  }
  localStorage.setItem("rommo_workspaces", JSON.stringify(current))
}
