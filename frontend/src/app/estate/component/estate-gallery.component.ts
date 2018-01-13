import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

@Component({
  selector: 'app-estate-gallery',
  templateUrl: './estate-gallery.component.html',
  styleUrls: ['./estate-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstateGalleryComponent implements OnInit {
  @Input() public images: string[];

  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  ngOnInit(): void {
    this.initImages();
  }

  private initImages() {
    this.galleryOptions = [
      // Full width
      {
        width: '100%',
        height: '400px',
        thumbnails: false,
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

    this.galleryImages = this.images.map(img => {
      return {
        small: img,
        medium: img,
        big: img
      }
    });
  }
}
