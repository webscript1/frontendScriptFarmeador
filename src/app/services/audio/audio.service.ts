import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio('../assets/audio/notifications-sound-127856.mp3');
  }

  playNotificationSound() {
    this.audio.play();
  }
}
