import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {User} from '../userlist/userlist.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Disposition': 'attachment'})
};

@Injectable()
export class ChatService {
  private backendUrl = 'simple-chat-n-backend.eu-de.mybluemix.net'; // simple-chat-n-backend.eu-de.mybluemix.net
  private socket;
  private username = '';
  private currentRoomId: String;

  constructor(private http: HttpClient) {
    this.socket = io(this.backendUrl);
    this.socket.on('connect', () => {
      this.selectName(this.username);
    });
  }

  public sendMessage(message, file: File) {
    if (this.currentRoomId != null) {
      // If there is a File, send it
      if (file != null) {
        const roomID = this.currentRoomId;
        console.log(file);
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.http.post('https://' + this.backendUrl + '/upload', formData)
          .subscribe((data) => {
            console.log(data);
            const fileMessage = {message: message, type: 'media', file: data};
            this.socket.emit('chat message', fileMessage);
          });
      } else {
        this.socket.emit('chat message', {message: message, type: 'text'});
      }
    }

  }

  public getTone = () => {
    return new Observable(observer => {
      this.socket.on('tone', (data) => {
        observer.next(data);
      });
    });
  };

  public getMessages = () => {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      this.socket.on('error', (data) => {
        console.log('Error: ' + data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  };

  public getUsers = () => {
    return new Observable(observer => {
      this.socket.on('userlist update', (data) => {
        observer.next(data);
      });
    });
  };

  public getRooms = () => {
    return new Observable(observer => {
      this.socket.on('all rooms', (data) => {
        console.log('Received all rooms!');
        observer.next(data);
      });
      this.socket.on('room added', (data) => {
        console.log(data.newRoom);
        observer.next(data);
      });
    });
  };

  public selectName(name: string) {
    this.username = name;
    this.socket.emit('name selected', {nickname: name});
    this.socket.emit('get users');
  }

  public joinRoom = (roomID: string) => {
    this.currentRoomId = roomID;
    this.socket.emit('subscribe', {roomId: roomID});
  };

  public createRoom = (name: string, type: string, users: User[]) => {
    this.socket.emit('create room', {name: name, type: type, users: users});
  };

  public checkUsername = (username: string) => {
    this.socket.emit('check username', {username: username});
    return new Observable( observer => {
      this.socket.on('username checked', (data) => {
        observer.next(data);
        return;
      });
      return;
    });
  };

  public registerNewUser = (username: string, password: string, color: string, language: string) => {
      this.socket.emit('register user', {username: username, password: password, color: color, language: language});
      return new Observable(observer => {
          this.socket.on('register user', (data) =>{
              observer.next(data);
              return;
          });
          return;
      })
  };

  public login = (username: string, password: string) => {
      this.socket.emit('login', {username: username, password: password});
      return new Observable(observer => {
          this.socket.on('login', (data) => {
              observer.next(data);
              return;
          });
          return;
      })
  };
}
