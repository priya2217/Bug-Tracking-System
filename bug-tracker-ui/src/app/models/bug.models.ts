// Your existing Bug model (keeping backward compatible)
export interface Bug {
  id?: number;
  title: string;
  description: string;
  status: string;
  severity: string;
  projectId: number;
  assigneeId: number;
  creatorId: number;
  createdDate?: Date;
  updatedDate?: Date;
  stepsToReproduce?: string;

  // NEW optional fields (won't break existing code)
  dueDate?: Date;
  priority?: string;
  labels?: string[];
  attachmentCount?: number;
  commentCount?: number;
}

// Your existing BugSummary (keeping as is)
export interface BugSummary {
  totalBugs: number;
  open: number;
  inProgress: number;
  resolved: number;

  // NEW optional fields
  inReview?: number;
}

// NEW: Extended bug for details page
export interface BugDetail extends Bug {
  comments?: Comment[];
  attachments?: Attachment[];
  activities?: Activity[];
  project?: Project;
  assignee?: User;
  creator?: User;
}

// NEW: Comment model
export interface Comment {
  id: number;
  bugId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

// NEW: Attachment model
export interface Attachment {
  id: number;
  bugId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: number;
  uploadedAt: Date;
}

// NEW: Activity/History model
export interface Activity {
  id: number;
  bugId: number;
  userId: number;
  userName: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

// NEW: User model
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

// NEW: Project model
export interface Project {
  id: number;
  name: string;
  description?: string;
}

// NEW: Label model
export interface Label {
  id: number;
  name: string;
  color: string;
}

// NEW: Filter options
export interface BugFilters {
  status?: string;
  severity?: string;
  priority?: string;
  assigneeId?: number;
  projectId?: number;
  searchTerm?: string;
}
