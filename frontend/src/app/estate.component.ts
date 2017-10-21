import {Component, Input, OnInit} from '@angular/core';
import {Estate} from "../model/estate";
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent implements OnInit {
  @Input() public estate: Estate;

  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  ngOnInit(): void {
    this.initImages();
  }

  private initImages() {
    if (!this.estate.images.length) {
      return;
    }

    this.galleryOptions = [
      // Full width
      {
        width: '100%',
        height: '600px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageInfinityMove: true
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '400px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        imageInfinityMove: true
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
        imageInfinityMove: true
      }
    ];

    this.galleryImages = this.estate.images.map(img => {
      return {
        small: img,
        medium: img,
        big: img
      }
    });
  }
}
