import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {OtrosIngresosComponent } from './componentes/otrosingresos.component';

const routes: Routes = [
    {
        path: '', component: OtrosIngresosComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtrosIngresosRoutingModule { }
