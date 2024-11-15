import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CargosComponent } from './componentes/cargos.component';

const routes: Routes = [
    {
        path: '', component: CargosComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CargosRoutingModule { }
