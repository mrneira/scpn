import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ProcesoComponent } from './componentes/proceso.component';

const routes: Routes = [
    {
        path: '', component: ProcesoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcesoRoutingModule { }
