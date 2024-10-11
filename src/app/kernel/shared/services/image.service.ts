import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from './../services/base-resource.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { IImage } from '../entities/image';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService extends BaseResourceService<IImage> {
  private readonly httpOpt = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  constructor(protected injector: Injector) {
    super('admin/images', injector, IImage.fromJson);
  }

  createFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const request = new HttpRequest(
      'POST',
      `${environment.apiUrl}/${this.apiPath}`,
      formData
    );

    return this.http.request(request);
  }

  createFilePromise(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const request = new HttpRequest(
      'POST',
      `${environment.apiUrl}/${this.apiPath}`,
      formData
    );

    return this.http.request(request).toPromise();
  }

  createFilesPromise(files: File[]): Promise<any> {
    const formData = new FormData();

    Array.from(files).map((file) => {
      formData.append('files', file, file.name);
    });

    const request = new HttpRequest(
      'POST',
      `${environment.apiUrl}/${this.apiPath}`,
      formData
    );

    return this.http.request(request).toPromise();
  }

  deleteFile(filename: string) {
    return this.http.delete(
      `${environment.apiUrl}/${this.apiPath}/${filename}`
    );
  }

  convertImageBase64ToBlob(image: string) {
    image.indexOf('data:image/png;base64,') == 0
      ? (image = image.replace('data:image/png;base64,', ''))
      : null;
    image.indexOf('data:image/jpg;base64,') == 0
      ? (image = image.replace('data:image/jpg;base64,', ''))
      : null;
    image.indexOf('data:image/jpeg;base64,') == 0
      ? (image = image.replace('data:image/jpeg;base64,', ''))
      : null;

    const date = new Date().valueOf();
    let text = '';
    const possibleText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type
    const imageName = date + '.' + text + '.jpeg';
    // call method that creates a blob from dataUri
    const imageBlob = this.dataURItoBlob(image);
    const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

    return imageFile;
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
