export class Estate {
  public balcony?: number;
  public district: number;
  public elevator?: boolean;
  public floor?: number;
  public heating?: string;
  public images: string[];
  public price: number;
  public address: string;
  public rooms: number;
  public halfrooms: number;
  public size: number;
  public source: string;
  public url: string;

  public get pricePerSquareMeters(): number {
    return Math.ceil(this.price / this.size);
  }
}
