import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments-service';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments  {

  taskId = input.required<number>();
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar);


  private dialogRef = inject(MatDialogRef<Comments>, { optional: true });
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  taskTitle = signal<string>('Task Comments');

  allComments = this.commentsService.comments;
  
  newCommentContent = signal('');
  isExpanded = signal(false); 
  effectiveTaskId!: number;

  ngOnInit() {
   this.effectiveTaskId = this.dialogData?.taskId || this.taskId();

    if (this.dialogData?.title) {
      this.taskTitle.set(this.dialogData.title);
    }
    
    this.commentsService.getCommentsByTaskId(this.effectiveTaskId).subscribe();
  }

close() {
  if (this.dialogRef) {
    this.dialogRef.close();
  } else {
    this.isExpanded.set(false); // סגירה אם זה בתוך הכרטיס
  }
}

  toggleComments() {
    this.isExpanded.update(val => !val);
    
    if (this.isExpanded()) {
      this.commentsService.getCommentsByTaskId(this.taskId()).subscribe();
    }
  }

  onAddComment() {
    if (this.newCommentContent().trim()) {
      this.commentsService.addComment(this.effectiveTaskId, this.newCommentContent()).subscribe({
        next: () => {
          this.newCommentContent.set(''); 
        },
        error: (err) => {
          this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
}
}