import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/share'
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {environment} from "../../../environments/environment";


@Injectable()
export class WebsocketRepository {
  private readonly endpoint = (environment.production ? 'wss' : 'ws') + `://${location.hostname}${location.port ? ':' + location.port : ''}/poll`;

  private inputStream: Subject<string>;
  private messages: BehaviorSubject<any>;
  public messages$: Observable<any>;

  private socketObservable: Observable<string>;

  private connected = false;

  constructor() {
    this.inputStream = new Subject<string>();
    this.messages = new BehaviorSubject<any>({id:'ping'});
    this.messages$ = this.messages.asObservable();
    this.connect();
  }

  private connect() {
    if (this.connected) {
      return;
    }

    this.websocketConnect();
    this.connected = true;
  }

  public send(message: any): void {
    this.inputStream.next(JSON.stringify(message));
  }

  private websocketConnect(): BehaviorSubject<number> {
    const connectionStatus = new BehaviorSubject<number>(0);

    this.socketObservable = new Observable<string>(observer => {
      const socket = new WebSocket(this.endpoint);
      let inputSubscription: Subscription;

      let open = false;
      let pingTimer;
      const closed = () => {
        if (!open) {
          return;
        }

        clearInterval(pingTimer);
        connectionStatus.next(connectionStatus.getValue() - 1);
        open = false;
      };
      const reconnect = () => {
        closed();
        setTimeout(() => {
          this.websocketConnect();
        }, 60000);
      };

      socket.onopen = () => {
        open = true;
        connectionStatus.next(connectionStatus.getValue() + 1);
        inputSubscription = this.inputStream.subscribe(data => {
          socket.send(data);
        });
        pingTimer = setInterval(() => {
          this.send("ping");
        }, 3 * 60 * 1000);
      };

      socket.onmessage = (message: MessageEvent) => {
        observer.next(message.data);
      };

      socket.onerror = (error: ErrorEvent) => {
        closed();
        observer.complete();
      };

      socket.onclose = (event: CloseEvent) => {
        closed();
        if (event.wasClean) {
          observer.complete();
        } else {
          observer.complete();
          reconnect();
        }
      };

      return () => {
        if (inputSubscription) {
          inputSubscription.unsubscribe();
        }

        if (socket) {
          closed();
          socket.close();
        }
      }
    });

    this.socketObservable.subscribe((message: string) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch (e) {
        data = message;
      }
      this.messages.next(data);
    });

    return connectionStatus;
  }
}
