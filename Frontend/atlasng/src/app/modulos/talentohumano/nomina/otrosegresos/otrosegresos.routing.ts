import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {OtrosEgresosComponent } from './componentes/otrosegresos.component';

const routes: Routes = [
    {
        path: '', component: OtrosEgresosComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtrosEgresosRoutingModule { }
