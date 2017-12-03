import {Injectable} from "@angular/core";
import {WebsocketRepository} from "../repository/websocket.repository";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Estate} from "../model/estate";
import {EstateParser} from "../parsers/estate.parser";
import {PushNotificationService} from "../service/push-notification.service";

interface NewEstatesData {
  id: string;
  estates: any[];
}

enum MessageType {
  NEW_ESTATES = 'new-estates'
}

@Injectable()
export class WebsocketEventsStore {
  private newEstates = new BehaviorSubject<Estate[]>([]);
  public newEstates$ = this.newEstates.asObservable();

  constructor(private websocketRepository: WebsocketRepository,
              private estateParser: EstateParser,
              private pushNotificationService: PushNotificationService) {
    this.websocketRepository.messages$.subscribe(data => {
      this.handleMessage(data.id, data);
    });
  }

  private handleMessage(id, data): void {
    switch (id) {
      case MessageType.NEW_ESTATES:
        this.handleNewEstates(data);
        break;
    }
  }

  private handleNewEstates(data: NewEstatesData) {
    const estates = this.estateParser.parse(data.estates);
    this.newEstates.next(estates);
    this.pushNotificationService.show(data.estates.length + " új ingatlan jelent meg az Ingatlanfigyelőben!");
  }
}
