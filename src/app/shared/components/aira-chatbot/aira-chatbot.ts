import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  showTools?: boolean;
}

@Component({
  selector: 'app-aira-chatbot',
  standalone: true,
  templateUrl: './aira-chatbot.html',
  styleUrls: ['./aira-chatbot.css'],
  imports: [
    CommonModule,
    FormsModule
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

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.greetUser();
    }
  }

  expandChat() {
    this.isExpanded.set(true);
  }

  collapseChat() {
    this.isExpanded.set(false);
  }

  greetUser() {
    if (this.messages().length === 0) {
      this.messages.update(m => [
        ...m,
        { sender: 'bot', text: `Hi Neelameghashyam! How can I help you today?`, showTools: false }
      ]);
    }
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;
    this.messages.update(m => [...m, { sender: 'user', text }]);
    this.userInput.set('');
    this.awaitingResponse.set(true);

    setTimeout(() => {
      this.awaitingResponse.set(false);
      if (text.toLowerCase().includes('ref dr recall low')) {
        this.messages.update(m => [
          ...m,
          {
            sender: 'bot',
            text: `The Ref Dr recall is low due to limited campaign targeting. 👉 Click here to view the document`,
            showTools: true
          }
        ]);
      } else {
        this.messages.update(m => [
          ...m,
          { sender: 'bot', text: `Sorry, I couldn’t find anything relevant. Try rephrasing.`, showTools: false }
        ]);
      }
    }, 1200);
  }

  copyMessage(text: string) {
    navigator.clipboard.writeText(text);
  }

  thumbsDown() {
    this.showFeedbackBox.set(true);
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
