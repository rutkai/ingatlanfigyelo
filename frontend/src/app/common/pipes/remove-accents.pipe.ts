import {Pipe, PipeTransform} from "@angular/core";
import * as Diacritics from 'diacritic';

@Pipe({name: 'removeAccents'})
export class RemoveAccentsPipe implements PipeTransform {
  public transform(value: string): string {
    return Diacritics.clean(value);
  }
}
