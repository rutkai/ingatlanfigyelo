export class Estate {
  public id: string;

  public balcony?: number;
  public district: number;
  public elevator?: boolean;
  public floor?: number;
  public heating?: string;
  public images: string[];
  public price: number;
  public squareMeterPrice: number;
  public address: string;
  public rooms: number;
  public halfrooms: number;
  public size: number;
  public material?: string;
  public descriptionHtml: string;
  public source: string;
  public url: string;
  public urls: { [url: string]: string };
  public updated: Date;

  public favourite: boolean;
  public isSeen: boolean;
}
