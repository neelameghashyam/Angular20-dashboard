import { Component, HostListener, signal, ViewChild, ElementRef, AfterViewChecked, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';

// Animation Imports
import { trigger, style, transition, animate } from '@angular/animations';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  showTools?: boolean;
  liked?: boolean;
  disliked?: boolean;
}

@Component({
  selector: 'app-aira-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatRippleModule,
    MatBadgeModule
  ],
  templateUrl: './aira-chatbot.html',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AiraChatbot implements AfterViewChecked {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Reactive signals
  isOpen = signal(false);
  isExpanded = signal(false);
  messages = signal<ChatMessage[]>([]);
  userInput = signal('');
  awaitingResponse = signal(false);
  showFeedbackBox = signal(false);
  feedbackText = signal('');
  
  // User data
  username = 'Ram';

  // Form for message input
  messageForm: FormGroup;
  feedbackForm: FormGroup;

  // Quick action options
  quickOptions = [
    'Top clients by Patient Smart Assist',
    'Unmapped Location count?',
    'Why is Ref Dr recall low?',
    'AI resolution rate?',
    'Compare mapping accuracy by client'
  ];

  constructor() {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.feedbackForm = this.fb.group({
      feedback: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    
    if (this.isOpen()) {
      // Focus input when opening
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 350);
    }
  }

  expandChat() {
    this.isExpanded.set(true);
  }

  collapseChat() {
    this.isExpanded.set(false);
  }

  sendQuickOption(option: string) {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'user',
      text: option,
      timestamp: new Date()
    };
    
    this.messages.update(m => [...m, message]);
    this.respondTo(option);
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    const message: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    this.messages.update(m => [...m, message]);
    this.userInput.set('');
    this.respondTo(text);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  respondTo(text: string) {
    this.awaitingResponse.set(true);
    
    setTimeout(() => {
      this.awaitingResponse.set(false);
      let responseText = '';
      
      if (text.toLowerCase().includes('ref dr recall low')) {
        responseText = 'The Ref Dr recall is low due to limited campaign targeting. 👉 Click here to view the document';
      } else {
        responseText = "Sorry, I couldn't find anything relevant. Try rephrasing.";
      }

      const botMessage: ChatMessage = {
        id: this.generateMessageId(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
        showTools: true,
        liked: false,
        disliked: false
      };

      this.messages.update(m => [...m, botMessage]);
    }, 1200);
  }

  
  thumbsUp(messageId: string) {
    this.messages.update(msgs => 
      msgs.map(msg => {
        if (msg.id === messageId) {
          const newLiked = !msg.liked;
          return {
            ...msg,
            liked: newLiked,
            disliked: newLiked ? false : msg.disliked
          };
        }
        return msg;
      })
    );
  }

  thumbsDown(messageId: string) {
    this.messages.update(msgs => 
      msgs.map(msg => {
        if (msg.id === messageId) {
          const newDisliked = !msg.disliked;
          if (newDisliked) {
            this.showFeedbackBox.set(true);
          }
          return {
            ...msg,
            disliked: newDisliked,
            liked: newDisliked ? false : msg.liked
          };
        }
        return msg;
      })
    );
  }

  submitFeedback() {
    const feedback = this.feedbackText().trim();
    if (!feedback) {
      this.showSnackBar('Please enter feedback before submitting.');
      return;
    }

    this.showFeedbackBox.set(false);
    this.feedbackText.set('');

    const thankYouMessage: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'bot',
      text: 'Thanks for your feedback!',
      timestamp: new Date(),
      showTools: false
    };

    this.messages.update(m => [...m, thankYouMessage]);
    this.showSnackBar('Feedback submitted successfully!');
  }

  cancelFeedback() {
    this.showFeedbackBox.set(false);
    this.feedbackText.set('');
  }

  private showSnackBar(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      try {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        console.warn('Could not scroll to bottom:', err);
      }
    }
  }

  private generateMessageId(): string {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.toggleChat();
  }
}