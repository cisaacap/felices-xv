import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var lucide: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying = false;
  seekValue = 0;
  currentTimeFormatted = '0:00';
  totalDurationFormatted = '3:45';
  simulatedDuration = 225; // 3:45 en segundos

  showPhraseModal = false;
  showFlowersModal = false;

  isBouquetOpen = false;
  selectedTulipTitle = '';
  selectedTulipText = '';

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  private updateIcons() {
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 0);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      audio.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.log('Audio placeholder mode (file in /assets/audio/song.mp3 pending):', err);
        this.isPlaying = true;
      });
    }
    this.updateIcons();
  }

  rewind() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.duration) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    } else {
      let cur = (this.seekValue / 100) * this.simulatedDuration;
      cur = Math.max(0, cur - 10);
      this.seekValue = (cur / this.simulatedDuration) * 100;
      this.currentTimeFormatted = this.formatTime(cur);
    }
  }

  forward() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.duration) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    } else {
      let cur = (this.seekValue / 100) * this.simulatedDuration;
      cur = Math.min(this.simulatedDuration, cur + 10);
      this.seekValue = (cur / this.simulatedDuration) * 100;
      this.currentTimeFormatted = this.formatTime(cur);
    }
  }

  onSeekInput(event: any) {
    const val = event.target.value;
    const audio = this.audioPlayer.nativeElement;
    if (audio.duration) {
      audio.currentTime = (val / 100) * audio.duration;
    } else {
      const cur = (val / 100) * this.simulatedDuration;
      this.currentTimeFormatted = this.formatTime(cur);
    }
  }

  onTimeUpdate() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.duration) {
      this.seekValue = (audio.currentTime / audio.duration) * 100;
      this.currentTimeFormatted = this.formatTime(audio.currentTime);
      this.totalDurationFormatted = this.formatTime(audio.duration);
    }
  }

  openPhraseModal() {
    this.showPhraseModal = true;
    this.updateIcons();
  }

  closePhraseModal() {
    this.showPhraseModal = false;
  }

  openFlowersModal() {
    this.showFlowersModal = true;
    this.isBouquetOpen = false;
    this.selectedTulipTitle = '';
    this.selectedTulipText = '';
    this.updateIcons();
  }

  closeFlowersModal() {
    this.showFlowersModal = false;
  }

  selectTulip(title: string, text: string) {
    this.isBouquetOpen = true;
    this.selectedTulipTitle = title;
    this.selectedTulipText = text;
    this.updateIcons();
  }

  onBackdropClick(event: MouseEvent, modalType: 'phrase' | 'flowers') {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      if (modalType === 'phrase') this.closePhraseModal();
      if (modalType === 'flowers') this.closeFlowersModal();
    }
  }
}