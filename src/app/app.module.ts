import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import {ChatService} from './services/chat.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChatroomslistComponent } from './chatroomslist/chatroomslist.component';
import { UserlistComponent } from './userlist/userlist.component';
import {HttpClientModule} from '@angular/common/http';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    ChatroomslistComponent,
    UserlistComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      BrowserAnimationsModule,
      MatOptionModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatNativeDateModule,
      ColorPickerModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
