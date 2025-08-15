import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  showTools?: boolean;
  liked?: boolean;
  disliked?: boolean;
}

@Component({
  selector: 'app-aira-chatbot',
  standalone: true,
  templateUrl: './aira-chatbot.html',
  styleUrls: ['./aira-chatbot.css'],
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class AiraChatbot {
  isOpen = signal(false);
  isExpanded = signal(false);
  messages = signal<ChatMessage[]>([]);
  userInput = signal('');
  awaitingResponse = signal(false);
  showFeedbackBox = signal(false);
  feedbackText = signal('');
  username = 'Ram';

  quickOptions = [
    'Top clients by Patient Smart Assist',
    'Unmapped Location count?',
    'Why is Ref Dr recall low?',
    'AI resolution rate?',
    'Compare mapping accuracy by client'
  ];

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  expandChat() {
    this.isExpanded.set(true);
  }

  collapseChat() {
    this.isExpanded.set(false);
  }

  sendQuickOption(option: string) {
    this.messages.update(m => [...m, { sender: 'user', text: option }]);
    this.respondTo(option);
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;
    this.messages.update(m => [...m, { sender: 'user', text }]);
    this.userInput.set('');
    this.respondTo(text);
  }

  respondTo(text: string) {
    this.awaitingResponse.set(true);
    setTimeout(() => {
      this.awaitingResponse.set(false);
      if (text.toLowerCase().includes('ref dr recall low')) {
        this.messages.update(m => [
          ...m,
          {
            sender: 'bot',
            text: `The Ref Dr recall is low due to limited campaign targeting. 👉 Click here to view the document`,
            showTools: true,
            liked: false,
            disliked: false
          }
        ]);
      } else {
        this.messages.update(m => [
          ...m,
          { sender: 'bot', text: `Sorry, I couldn’t find anything relevant. Try rephrasing.`, showTools: true, liked: false, disliked: false }
        ]);
      }
    }, 1200);
  }

  copyMessage(text: string) {
    navigator.clipboard.writeText(text);
  }

  thumbsUp(index: number) {
    this.messages.update(msgs => {
      msgs[index].liked = !msgs[index].liked;
      if (msgs[index].liked) msgs[index].disliked = false;
      return [...msgs];
    });
  }

  thumbsDown(index: number) {
    this.messages.update(msgs => {
      msgs[index].disliked = !msgs[index].disliked;
      if (msgs[index].disliked) {
        msgs[index].liked = false;
        this.showFeedbackBox.set(true);
      }
      return [...msgs];
    });
  }

  submitFeedback() {
    if (!this.feedbackText().trim()) {
      alert('Please enter feedback before submitting.');
      return;
    }
    this.showFeedbackBox.set(false);
    this.feedbackText.set('');
    this.messages.update(m => [
      ...m,
      { sender: 'bot', text: `Thanks for your feedback!`, showTools: false }
    ]);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.toggleChat();
  }
}
