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
  @Input() public loadContent: boolean;

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
        height: '460px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageInfinityMove: true,
        previewInfinityMove: true
      },
      // max-width 500
      {
        breakpoint: 500,
        width: '100%',
        height: '300px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        imageInfinityMove: true,
        previewInfinityMove: true
      },
      // max-width 400
      {
        breakpoint: 400,
        width: '100%',
        height: '250px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        imageInfinityMove: true,
        previewInfinityMove: true
      },
      // max-width 300
      {
        breakpoint: 300,
        preview: false,
        imageInfinityMove: true,
        previewInfinityMove: true
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
