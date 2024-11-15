import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AprobacionOtrosEgresosComponent } from './componentes/aprobacionotrosegresos.component';

const routes: Routes = [
    {
        path: '', component: AprobacionOtrosEgresosComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AprobacionOtrosEgresosRoutingModule { }
