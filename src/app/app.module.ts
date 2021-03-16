import {Inject, Injectable, InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Action, StoreModule} from '@ngrx/store';
import {Actions, createEffect, Effect, EffectsModule, ofType} from '@ngrx/effects';
import {switchMapTo} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface AwesomeProxy {
    [key: string]: Promise<string>;
}

export const PROXY_OBJECT_TOKEN = new InjectionToken<AwesomeProxy>(
    'Proxy Object'
);

@Injectable()
export class MyEffects {
    mimboJimbo$ = createEffect(() => this.actions$.pipe(
        ofType('A'),
        switchMapTo([])
    ));

    @Effect()
    mumboJumbo$: Observable<Action> = this.actions$.pipe(
        // ofType('B'),
        switchMapTo([])
    );

    constructor(
        private actions$: Actions,
        @Inject(PROXY_OBJECT_TOKEN) private proxyObject: AwesomeProxy
    ) {
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([MyEffects])
    ],
    providers: [
        {
            provide: PROXY_OBJECT_TOKEN, useFactory: () => new Proxy({},
                {
                    // tslint:disable-next-line:typedef
                    get(_, prop) {
                        return () => Promise.resolve('bob');
                    }
                }
            )
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
