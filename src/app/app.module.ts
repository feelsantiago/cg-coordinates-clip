import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputCoordinatesComponent, TransformationResultComponent } from './components';
import { TransformationComponent } from './pages/transformation/transformation.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';
import { CanvasComponent } from './components/canvas/canvas.component';

@NgModule({
    declarations: [
        AppComponent,
        TransformationComponent,
        CoordinatesComponent,
        InputCoordinatesComponent,
        TransformationResultComponent,
        CanvasComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
