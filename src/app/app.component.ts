import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EditorApi, MentionUser, NgxUniversalEditorModule, UniversalEditorConfig } from 'ngx-universal-editor';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxUniversalEditorModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  users: MentionUser[] = [
    {
      id: '1-xxxaxsax',
      firstName: 'Nikola',
      lastName: 'Vojvodic',
      email: 'nikola.vojvodic@email.com',
    },
    {
      id: '2-21321321',
      firstName: 'Miljan',
      lastName: 'Jovic',
      email: 'miljan.jovic@email.com',
    },
    {
      id: '3das dasdsa',
      firstName: 'Pera',
      lastName: 'Peric',
      email: 'pera.peric@email.com',
    },
    {
      id: '1-ewqe',
      firstName: 'Nikola',
      lastName: 'Vojvodic',
      email: 'nikola.vojvodic@email.com',
    },
    {
      id: '2-qwrgfdsg',
      firstName: 'Miljan',
      lastName: 'Jovic',
      email: 'miljan.jovic@email.com',
    },
    {
      id: '3dasgergredasdsa',
      firstName: 'Pera',
      lastName: 'Peric',
      email: 'pera.peric@email.com',
    },
    {
      id: '1-xrtertxxaxtetersax',
      firstName: 'Nikola',
      lastName: 'Vojvodic',
      email: 'nikola.vojvodic@email.com',
    },
    {
      id: '2-2132retert1321',
      firstName: 'Miljan',
      lastName: 'Jovic',
      email: 'miljan.jovicc@email.com',
    },
    {
      id: '3das dfsdfsdfdsfasdsa',
      firstName: 'Pera',
      lastName: 'Peric',
      email: 'pera.peric@email.com',
    },
  ];
  editorApi!:EditorApi;
  config = new UniversalEditorConfig({
    enableBold: true,
    enableItalic: true,
    mentionPosition: 'auto',
    contenteditable: true,
    //initialInnerHTML: '<p>NIKOLA</p>',
    placeholderText: 'Type @ to mention and notify someone',
  });

  private accessKey = 'UXnAMwNyxHDH17xlcexNARjC8qO0nogxa2Neez4SXow';
  http = inject(HttpClient);
  ngOnInit() {
    /* from(this.users).pipe(
      concatMap(user => this.getRandomPhoto().pipe(
        map(photo => ({
          ...user,
          imageUrl: photo.urls.small
        }))
      )),
      toArray()).subscribe(updatedUsers => {
      this.users = updatedUsers;
      //console.log(this.users);
    }); */
  }

  getRandomPhoto(): Observable<any> {
    const url = `https://api.unsplash.com/photos/random?client_id=${this.accessKey}`;
    return this.http.get(url);
  }

  onChangeIds(event:any){
    //console.log(event)
  }
  onChangeText(event:any){
    //console.log(event)
  }

  onEditorReady(event: any){
    this.editorApi = event;
    /* setTimeout(() => {
      this.editorApi.triggerMention();
    }, 3000); */
    //this.editorApi.setInnerHTML('<p><span class="universal-editor-text-color" style="color:#FF0000;" custom-text-color-name="Red" custom-text-color-code="#FF0000">Nikola</span></p>');
  } 
}
