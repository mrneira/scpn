import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LiquidacionesComponent } from './componentes/liquidaciones.component';

const routes: Routes = [
    {
        path: '', component: LiquidacionesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiquidacionesRoutingModule { }
