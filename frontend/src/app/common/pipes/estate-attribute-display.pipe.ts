import {Pipe, PipeTransform} from "@angular/core";
import {EstateAttributes} from "../model/filters/estate-attributes";

@Pipe({name: 'estateAttributeDisplay'})
export class EstateAttributeDisplayPipe implements PipeTransform {
  public transform(value: string): string {
    switch (value) {
      case EstateAttributes.PRICE:
        return 'Ár';
      case EstateAttributes.BALCONY:
        return 'Erkély';
      case EstateAttributes.CITY:
        return 'Város';
      case EstateAttributes.REGION:
        return 'Régió/Megye';
      case EstateAttributes.DISTRICT:
        return 'Kerület';
      case EstateAttributes.ELEVATOR:
        return 'Lift';
      case EstateAttributes.FLOOR:
        return 'Emelet';
      case EstateAttributes.HALF_ROOMS:
        return 'Félszobák';
      case EstateAttributes.ROOMS:
        return 'Szobák';
      case EstateAttributes.HEATING:
        return 'Fűtés';
      case EstateAttributes.SIZE:
        return 'Méret';
      case EstateAttributes.MATERIAL:
        return 'Épület anyaga';
      case EstateAttributes.DESCRIPTION:
        return 'Leírás';
      case EstateAttributes.SQUARE_METER_PRICE:
        return 'Négyzetméter ár';
      case EstateAttributes.SOURCE:
        return 'Forrás';
      default:
        return '';
    }
  }
}
