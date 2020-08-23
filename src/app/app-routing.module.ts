import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransformationComponent } from './pages/transformation/transformation.component';
import { InterpolationComponent } from './pages/interpolation/interpolation.component';

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
