import { Component, OnInit } from '@angular/core';
import {ChatService} from '../services/chat.service';

enum RoomType {
  Private = 'private',
  Public = 'public'
}

export interface Room {
  name: string;
  id: string;
  isPrivate: boolean;
  type: RoomType;
}

@Component({
  selector: 'app-chatroomslist',
  templateUrl: './chatroomslist.component.html',
  styleUrls: ['./chatroomslist.component.css']
})
export class ChatroomslistComponent implements OnInit {
  room: Room;
  rooms: Room[] = [];
  public roomCreation;
  public newRoomName;

  constructor(private chatService: ChatService) {}

  // TODO implement Chatroomlist logic
  ngOnInit() {
    this.newRoomName = '';
    this.roomCreation = false;
    this.chatService
      .getRooms()
      .subscribe((data: any) => {
        if (data.dataType === 'ALL_ROOMS') {
          this.rooms = data.roomData;
        } else if (data.dataType === 'ROOM_ADDED') {
          this.rooms.push(data.newRoom);
        }
      });
  }

  public joinRoom(room: Room) {
    this.chatService.joinRoom(room.id);
  }

  public createNewRoom() {
    this.chatService.createRoom(this.newRoomName, 'public', []);
    this.newRoomName = '';
    this.roomCreation = !this.roomCreation;
  }
}
