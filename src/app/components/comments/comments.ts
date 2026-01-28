import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments-service';

@Component({
  selector: 'app-comments',
  imports: [FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {

   taskId = input.required<number>();
   private commentsService = inject(CommentsService);

   allComments = this.commentsService.comments;
   newCommentContent = signal('');
   isExpanded = signal(false); 

toggleComments() {
    this.isExpanded.update(val => !val);
    if (this.isExpanded() && this.allComments().length === 0) {
      this.commentsService.getCommentsByTaskId(this.taskId()).subscribe();
    }
  }

   ngOnInit() {
      this.commentsService.getCommentsByTaskId(this.taskId()).subscribe();
  }

  onAddComment() {
    if (this.newCommentContent().trim()) {
      this.commentsService.addComment(this.taskId(), this.newCommentContent()).subscribe({
        next: () => {
          this.newCommentContent.set(''); 
        },
        error: (err) => alert('שגיאה בהוספת תגובה: ' + err.message)
      });
    }
  }

}
