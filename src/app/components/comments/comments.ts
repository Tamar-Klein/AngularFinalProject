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
    MatTooltipModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments implements OnInit {

  taskId = input.required<number>();
  private commentsService = inject(CommentsService);
  private snackBar = inject(MatSnackBar); // UI Feedback

  // הערה: יש לוודא שהסרוויס מסנן את התגובות לפי ה-ID של המשימה הנוכחית
  // או שהקומפוננטה מסננת אותן כאן. בהנחה שהסרוויס מטפל בזה:
  allComments = this.commentsService.comments;
  
  newCommentContent = signal('');
  isExpanded = signal(false); 

  ngOnInit() {
     // טעינה ראשונית (אופציונלי, תלוי אם רוצים לטעון הכל מראש או רק בפתיחה)
     // this.commentsService.getCommentsByTaskId(this.taskId()).subscribe();
  }

  toggleComments() {
    this.isExpanded.update(val => !val);
    
    // טעינה רק כשפותחים את הטאב (Lazy Load) - חוסך משאבים
    if (this.isExpanded()) {
      this.commentsService.getCommentsByTaskId(this.taskId()).subscribe();
    }
  }

  onAddComment() {
    if (this.newCommentContent().trim()) {
      this.commentsService.addComment(this.taskId(), this.newCommentContent()).subscribe({
        next: () => {
          this.newCommentContent.set(''); 
          // אין צורך בהודעת הצלחה על כל תגובה בצ'אט, זה מציק. רק ניקוי שדה.
        },
        error: (err) => {
          this.snackBar.open('Error adding comment', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}