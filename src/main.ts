import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

/* eslint-disable no-console */
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((error) => console.error(error));
/* eslint-enable no-console */
