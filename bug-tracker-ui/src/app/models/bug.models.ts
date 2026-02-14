export interface Bug {
  id?: number;
  title: string;
  description: string;
  status: string;
  severity: string;
  projectId: number;
  assigneeTo: number;
  creatorBy: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface BugSummary {
  totalBugs: number;
  open: number;
  inProgress: number;
  resolved: number;
}
