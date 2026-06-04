import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { Bug } from '../../models/bug.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  bugs: Bug[] = [];
  filteredBugs: Bug[] = [];
  users: any[] = [];

  searchTerm = '';
  filterAssignee = '';
  showFilters = false;

  draggedBug: Bug | null = null;

  constructor(
    private bugService: BugService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadBugs();
    this.loadUsers();
  }

  loadBugs() {
    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        this.bugs = bugs;
        this.filteredBugs = bugs;
        this.filterBugs();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading bugs:', err);
      },
    });
  }

  loadUsers() {
    // Load users for assignee filter
    // For now, use mock data or extract from bugs
    const uniqueAssignees = new Set(
      this.bugs.map((b) => b.assigneeId).filter((id) => id),
    );
    this.users = Array.from(uniqueAssignees).map((id) => ({
      id,
      username: `User ${id}`,
    }));
  }

  filterBugs() {
    let filtered = [...this.bugs];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(
        (bug) =>
          bug.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          bug.description
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()),
      );
    }

    // Filter by assignee
    if (this.filterAssignee) {
      filtered = filtered.filter(
        (bug) => bug.assigneeId === Number(this.filterAssignee),
      );
    }

    this.filteredBugs = filtered;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getBugsByStatus(status: string): Bug[] {
    // Map status names
    const statusMap: { [key: string]: string } = {
      Open: 'Open',
      'In Progress': 'In Progress',
      'In Review': 'In Review',
      Resolved: 'Resolved',
    };

    return this.filteredBugs.filter((bug) => bug.status === statusMap[status]);
  }

  getColumnCount(status: string): number {
    return this.getBugsByStatus(status).length;
  }

  getAssigneeName(assigneeId: number): string {
    const user = this.users.find((u) => u.id === assigneeId);
    return user ? user.username : `User ${assigneeId}`;
  }

  getAssigneeInitial(assigneeId: number): string {
    const name = this.getAssigneeName(assigneeId);
    return name.charAt(0).toUpperCase();
  }

  // Drag and Drop functionality
  onDragStart(event: DragEvent, bug: Bug) {
    this.draggedBug = bug;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', event.target as any);
    }
  }

  onDragEnd(event: DragEvent) {
    this.draggedBug = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();

    if (this.draggedBug && this.draggedBug.status !== newStatus) {
      // Update bug status
      const updatedBug = { ...this.draggedBug, status: newStatus };

      this.bugService.updateBug(this.draggedBug.id!, updatedBug).subscribe({
        next: () => {
          // Update local bug
          const index = this.bugs.findIndex(
            (b) => b.id === this.draggedBug!.id,
          );
          if (index !== -1) {
            this.bugs[index].status = newStatus;
          }

          // Refresh filtered bugs
          this.filterBugs();

          // Show success message
          this.showToast(`Bug moved to ${newStatus}`, 'success');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating bug:', err);
          this.showToast('Failed to update bug status', 'error');
        },
      });
    }

    this.draggedBug = null;
  }

  openBugDetails(bug: Bug) {
    // Navigate to bug details page
    this.router.navigate(['/bugs', bug.id]);
  }

  openBugMenu(event: Event, bug: Bug) {
    event.stopPropagation();
    // Implement context menu or dropdown
    console.log('Open menu for bug:', bug);
  }

  createBugInColumn(status: string) {
    // Navigate to create bug with pre-selected status
    this.router.navigate(['/bugs'], {
      queryParams: { action: 'create', status: status },
    });
  }

  goBack() {
    this.router.navigate(['/bugs']);
  }

  // Toast notification helper
  showToast(message: string, type: 'success' | 'error' | 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success'
        ? 'bg-green-600'
        : type === 'error'
          ? 'bg-red-600'
          : 'bg-blue-600'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
