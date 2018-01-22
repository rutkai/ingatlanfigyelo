import {Pipe, PipeTransform} from "@angular/core";
import * as md5 from "md5";
import {User} from "../../common";

@Pipe({name: 'gravatarEmailHash'})
export class GravatarEmailHashPipe implements PipeTransform {
  public transform(user: User): string {
    return md5(user.username.trim().toLowerCase());
  }
}
