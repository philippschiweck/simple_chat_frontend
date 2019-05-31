import {Component, EventEmitter, NgModule, OnDestroy, OnInit} from '@angular/core';
import { ChatService} from './services/chat.service';
import {Subscription} from "rxjs";

interface State {
    userState: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Simple Chat';
  usernameSelected: boolean;
  username: string;
  password: string;
  newUsername: string;
  newPassword: string;
  state: State;
  userNameElligible: boolean;
  usernameAvailable: boolean;
  selectedLanguage: string;
  loginFailed: boolean;
  profilePicture: File;
  color: string;
  private usernameSubscription: Subscription;

  languages: String[] = [
      'None',
      'English',
      'German',
      'French'
  ];

  usernameRegEx = RegExp('[A-Za-z]{4,15}$');

  constructor(private chatService: ChatService) {
      this.state = {
          userState: 'notLoggedIn'
      };
  }

  ngOnInit() {
      if(location.protocol != 'https:'){
          location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
      }
    this.selectedLanguage = "None";
    this.username = '';
    this.loginFailed = false;
    this.newUsername = '';
    this.newPassword = '';
    this.color = '#000000';
    this.usernameSelected = false;
    this.userNameElligible = false;
    this.chatService
        .getTone()
        .subscribe((data: any) => {
          const background = document.getElementById('background');
          console.log(data);

          if (data.toneValue < 0) {
              background.style.backgroundColor = '#accbe1';
          } else {
              background.style.backgroundColor = 'white';
          }
        });
  }

  public checkUsernameElligible(name: string){
      if(name.length >= 4 && name.length <= 15 && this.usernameRegEx.test(name)){
          this.userNameElligible = true;
          this.checkUsernameAvailable(name);
      } else {
          this.userNameElligible = false;
      }
  }

  private checkUsernameAvailable(name: string){
     this.usernameSubscription = this.chatService.checkUsername(name)
          .subscribe((data: any) => {
          if(data.usernameAvailable){
              this.usernameAvailable = true;
          }else{
              this.usernameAvailable = false;
          }
          return data.usernameAvailable;
          });
  }

  public login() {
      if(this.state.userState == 'login'){
          this.chatService.login(this.username, this.password)
              .subscribe((data: any) => {
                  if(data.result){
                      this.loginFailed = false;
                      this.state.userState = 'loggedIn';
                      this.chatService.selectName(this.username);
                      console.log('Login successful!');
                  } else {
                      this.loginFailed = true;
                      console.log('Failed to login!');
                  }
              });

      } else {
          this.state.userState = 'login';
      }
  }

  public register() {
      if(this.state.userState == 'register'){
          this.checkUsernameAvailable(this.newUsername)
          if(this.usernameAvailable && this.newPassword.length >= 5){
              this.chatService.registerNewUser(this.newUsername, this.newPassword, this.color, this.selectedLanguage)
                  .subscribe((data: any) => {
                      if(data.result){
                          this.username = this.newUsername;
                          this.password = this.newPassword;
                          this.state.userState = 'login';
                          this.login();
                          console.log('Registered successfully!');
                      } else {
                          window.alert('Could not register! Please try again!');
                      }
                  });
          }

      } else {
          this.state.userState = 'register';
      }
  }


  public checkCredentials() {
      this.state.userState = 'loggedIn';
    if (this.username !== '') {
      this.chatService.selectName(this.username);
      this.usernameSelected = !this.usernameSelected;
    }
  }

  public backState(){
      this.state.userState = 'notLoggedIn';
  }

  public onFileChange (event) {
      let file = event.target.files[0];
      if(file.size <= 5242880){
          this.profilePicture = event.target.files[0];
      } else {
          window.alert("Picture is too large! Max. size is 5mb!");
      }
  }

  public removeFile() {
      this.profilePicture = null;
  }

  public getExtension(filename) {
      let parts = filename.split('.');
      return parts[parts.length - 1];
  }
}
