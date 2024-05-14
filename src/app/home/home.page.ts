import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { VedioserviceService } from '../vedioservice.service';
import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import * as WebVPPlugin from 'capacitor-video-player';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('video') captureElement: ElementRef | undefined;
  mediaRecorder: any;
  videoPlayer: any;
  isRecording = false;
  videos :any[] = [];
 
  constructor(public videoService: VedioserviceService, private changeDetector: ChangeDetectorRef) {
  }
 
  async ngAfterViewInit() {
    this.videos = await this.videoService.loadVideos();
    if (Capacitor.isNativePlatform()) {
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer
    }
  }
 
  async recordVideo() {
    // Create a stream of video capturing
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: true
    });
 
    // Show the stream inside our video object
    this.captureElement!!.nativeElement.srcObject = stream;
 
    var options = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(stream, options);
    let chunks :any[] = [];
 
    // Store the video on stop
    this.mediaRecorder.onstop = async (event:any) => {
      const videoBuffer = new Blob(chunks, { type: 'video/webm' });
      await this.videoService.storeVideo(videoBuffer);
      
      // Reload our list
      this.videos = this.videoService.videos;
      this.changeDetector.detectChanges();
    }
 
    // Store chunks of recorded video
    this.mediaRecorder.ondataavailable = (event:any) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data)
      }
    }
 
    // Start recording wth chunks of data
    this.mediaRecorder.start(100);
    this.isRecording = true;
  }
 
  stopRecord() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement!!.nativeElement.srcObject = null;
    this.isRecording = false;
  }
 
  async play(video:any) {
    // Get the video as base64 data
    const realUrl = await this.videoService.getVideoUrl(video);
 
    // Show the player fullscreen
    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: realUrl,
      playerId: 'fullscreen',
      componentTag: 'app-home'
    });    
  }
}
