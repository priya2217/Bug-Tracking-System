import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Add this
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, // ✅ Required for *ngIf, *ngFor
    FormsModule,
    RouterModule, // ✅ Required for [routerLink]
  ],
})
export class BugModule {}
