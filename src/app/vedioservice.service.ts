import { Injectable } from '@angular/core';
import {
  Filesystem, Directory 
} from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

 
@Injectable({
  providedIn: 'root'
})
export class VedioserviceService {
  public videos: string[] = [];
  private VIDEOS_KEY: string = 'videos';
 
  constructor() {}
 
  async loadVideos() {
    const videoList  = await Preferences.get({ key: this.VIDEOS_KEY });
    this.videos = videoList.value ? JSON.parse(videoList.value) : [];
    return this.videos;
  }
 
  async storeVideo(blob:any) {
    const fileName = new Date().getTime() + '.mp4';
 
    const base64Data = await this.convertBlobToBase64(blob) as string;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    this.videos.unshift(savedFile.uri);

    return Preferences.set({
      key: this.VIDEOS_KEY,
      value: JSON.stringify(this.videos)
    });
  }
 
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
 
  async getVideoUrl(fullPath:any) {
    const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    const file = await Filesystem.readFile({
      path: path,
      directory: Directory.Data
    });
    return `data:video/mp4;base64,${file.data}`;
  }
}
