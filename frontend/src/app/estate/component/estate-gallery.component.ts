import {Component, HostListener, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

enum KeyCodes {
  ESCAPE = 27,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
}

@Component({
  selector: 'app-estate-gallery',
  templateUrl: './estate-gallery.component.html',
  styleUrls: ['./estate-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstateGalleryComponent implements OnInit {
  @Input() public images: string[];

  @ViewChild('gallery') gallery: NgxGalleryComponent;

  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  private previewOpen = false;

  ngOnInit(): void {
    this.initImages();
  }

  @HostListener('document:keyup', ['$event.keyCode'])
  public keyEvent(keyCode: number) {
    if (keyCode === KeyCodes.RIGHT_ARROW) {
      if (this.previewOpen) {
        this.gallery.preview.showNext();
      } else {
        this.gallery.showNext();
      }
    } else if (keyCode === KeyCodes.LEFT_ARROW) {
      if (this.previewOpen) {
        this.gallery.preview.showPrev();
      } else {
        this.gallery.showPrev();
      }
    } else if (keyCode === KeyCodes.ESCAPE) {
      this.gallery.preview.close();
    }
  }

  public previewOpened() {
    this.previewOpen = true;
  }

  public previewClosed() {
    this.previewOpen = false;
  }

  private initImages() {
    this.galleryOptions = [
      // Full width
      {
        width: '100%',
        height: '400px',
        thumbnails: false,
        preview: !!this.images.length,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageInfinityMove: true,
        previewInfinityMove: true
      },
      // max-width 500
      {
        breakpoint: 500,
        height: '300px',
        imagePercent: 80
      }
    ];

    if (this.images.length) {
      this.galleryImages = this.images.map(img => {
        return {
          small: img,
          medium: img,
          big: img
        }
      });
    } else {
      this.galleryImages = [
        {
          small: '/assets/logo.png',
          medium: '/assets/logo.png',
          big: '/assets/logo.png'
        }
      ];
    }
  }
}
