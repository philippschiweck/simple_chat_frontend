import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomslistComponent } from './chatroomslist.component';

describe('ChatroomslistComponent', () => {
  let component: ChatroomslistComponent;
  let fixture: ComponentFixture<ChatroomslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatroomslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
