import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransformationComponent } from './pages/transformation/transformation.component';
import { InterpolationComponent } from './pages/interpolation/interpolation.component';
import { DrawComponent } from './pages/draw/draw.component';
import { LinesComponent } from './pages/lines/lines.component';
import { CirclesComponent } from './pages/circles/circles.component';
import { FractalComponent } from './pages/fractal/fractal.component';

const routes: Routes = [
    {
        path: 'transformation',
        component: TransformationComponent,
    },
    {
        path: 'interpolation',
        component: InterpolationComponent,
    },
    {
        path: 'draw',
        component: DrawComponent,
        children: [
            {
                path: 'lines',
                component: LinesComponent,
            },
            {
                path: 'circles',
                component: CirclesComponent,
            },
            {
                path: '',
                redirectTo: 'lines',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'fractal',
        component: FractalComponent,
    },
    {
        path: '',
        redirectTo: 'transformation',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
