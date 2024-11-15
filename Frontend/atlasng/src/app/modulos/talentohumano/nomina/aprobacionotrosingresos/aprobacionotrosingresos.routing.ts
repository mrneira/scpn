import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AprobacionOtrosIngresosComponent } from './componentes/aprobacionotrosingresos.component';

const routes: Routes = [
    {
        path: '', component: AprobacionOtrosIngresosComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AprobacionOtrosIngresosRoutingModule { }
