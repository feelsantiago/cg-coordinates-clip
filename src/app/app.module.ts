import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputCoordinatesComponent, TransformationResultComponent } from './components';
import { TransformationComponent } from './pages/transformation/transformation.component';
import { InterpolationComponent } from './pages/interpolation/interpolation.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CanvasViewPortComponent } from './components/canvas-view-port/canvas-view-port.component';
import { InterpolationResultComponent } from './components/interpolation-result/interpolation-result.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DrawComponent } from './pages/draw/draw.component';
import { LinesComponent } from './pages/lines/lines.component';
import { CirclesComponent } from './pages/circles/circles.component';
import { LineDdaResultComponent } from './components/line-dda-result/line-dda-result.component';
import { LinePmResultComponent } from './components/line-pm-result/line-pm-result.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        TransformationComponent,
        InterpolationComponent,
        InputCoordinatesComponent,
        TransformationResultComponent,
        CanvasComponent,
        CanvasViewPortComponent,
        InterpolationResultComponent,
        DrawComponent,
        LinesComponent,
        CirclesComponent,
        LineDdaResultComponent,
        LinePmResultComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
