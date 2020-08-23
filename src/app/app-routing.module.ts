import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransformationComponent } from './pages/transformation/transformation.component';
import { CoordinatesComponent } from './pages/coordinates/coordinates.component';

const routes: Routes = [
    {
        path: 'transformation',
        component: TransformationComponent,
    },
    {
        path: 'coordinates',
        component: CoordinatesComponent,
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
