import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../services/chat.service';

export enum MessageType {
  ChatMessage = 'CHAT_MESSAGE',
  ServerMessage = 'SERVER_MESSAGE',
  RoomMessage = 'ROOM_MESSAGE',
  AllMessages = 'ALL_MESSAGES',
  MediaMessage = 'MEDIA_MESSAGE'
}

interface Message {
  name: string;
  date: string;
  message: string;
  color: string;
  type: MessageType;
  fileName: string;
  fileKey: string;
}

interface FileData {
  fileKey: string;
  fileName: string;
}

interface MessagePacket {
  type: string;
  messages: Message[];
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('chat') private chatScroll: ElementRef;
  message: string;
  messages: Message[] = [];
  MessageType = MessageType;
  file: File;


  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.message = '';
    this.chatService
      .getMessages()
      .subscribe((data) => {
        if ((<MessagePacket>data).type === MessageType.AllMessages) {
          this.messages = [];
          this.messages = (<MessagePacket>data).messages;
        } else {
          this.messages.push(<Message>data);
          console.log(<Message>data);
        }
      });
  }

  sendMessage() {
    if (this.message !== '') {
      this.chatService.sendMessage(this.message, this.file);
      this.message = '';
      this.file = null;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.chatScroll.nativeElement.scrollTop !== this.chatScroll.nativeElement.scrollHeight) {
        this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.log(err);
    }
  }
  onFileChange (event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  downloadFile(fileKey: string) {
    // simple-chat-n-backend.eu-de.mybluemix.net
    const url = 'https://simple-chat-n-backend.eu-de.mybluemix.net/download?fileKey=' + fileKey;
    const win = window.open(url, '_blank');
    win.opener = null;
    win.focus();
    // this.chatService.downloadFile(fileKey);
  }
  removeFile() {
    this.file = null;
  }
}
