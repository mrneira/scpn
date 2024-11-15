import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PlantillaVinculacionComponent } from './componentes/plantillavinculacion.component';

const routes: Routes = [
    {
        path: '', component: PlantillaVinculacionComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlantillaVinculacionRoutingModule { }
