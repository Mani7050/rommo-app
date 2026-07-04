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
  try {
    const res = await fetch("/api/workspaces")
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn("Failed fetching workspaces from API, falling back to local:", err)
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
  try {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(list)
    })
    if (res.ok) {
      return
    }
  } catch (err) {
    console.warn("Failed saving workspaces to API, falling back to local:", err)
  }
  localStorage.setItem("rommo_workspaces", JSON.stringify(list))
}

export async function saveWorkspaceSingle(workspace: any): Promise<void> {
  try {
    const res = await fetch("/api/workspaces/single", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(workspace)
    })
    if (res.ok) {
      return
    }
  } catch (err) {
    console.warn("Failed saving workspace to API, falling back to local:", err)
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
