export class Estate {
  public balcony?: number;
  public district: number;
  public elevator?: boolean;
  public floor?: number;
  public heating?: number;
  public images: string[];
  public price: number;
  public address: string;
  public rooms: string;
  public size: number;
  public source: string;
  public url: string;

  public get pricePerSquareMeters(): number {
    return Math.ceil(this.price / this.size);
  }
}
