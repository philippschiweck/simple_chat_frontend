import { Component, OnInit } from '@angular/core';
import {ChatService} from '../services/chat.service';

enum UpdateType {
  UserJoined = 'USER_JOINED',
  FullList = 'USERLIST',
  UserLeft = 'USER_LEFT'
}

export interface User {
  name: string;
  id: string;
  checked?: boolean;
}

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users: User[] = [];

  constructor(private chatService: ChatService) { }

  // TODO implement userlist logic
  ngOnInit() {
    this.chatService
      .getUsers()
      .subscribe((data: any) => {
        if (data.type === UpdateType.FullList) {
          this.users = data.list;
        } else if (data.type === UpdateType.UserJoined && data.user.name !== '') {
          const newUser = <User> {
            id: data.user.id,
            name: data.user.name,
            checked: false
          };
          this.users.push(newUser);
        } else if (data.type === UpdateType.UserLeft) {
          /*const newUser = <User> {
            id: data.user.id,
            name: data.user.name,
            checked: false
          };*/
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === data.user.id) {
              this.users.splice(i, 1);
            }
          }
        }
      });
  }

  public createPrivateChat() {
    const userList = [];

    for (const user of this.users) {
      if (user.checked) {
        user.checked = false;
        userList.push(user);
      }
    }
    if (userList.length > 0) {
      let roomName = 'Private Chat: ';
      for (const user of userList) {
        roomName += user.name;
        roomName += ', ';
      }
      this.chatService.createRoom(roomName, 'private', userList);
      console.log(userList);
    }

  }
}
