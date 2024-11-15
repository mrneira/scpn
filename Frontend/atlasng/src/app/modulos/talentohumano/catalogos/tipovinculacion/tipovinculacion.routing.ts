import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TipoVinculacionComponent } from './componentes/tipovinculacion.component';

const routes: Routes = [
    {
        path: '', component: TipoVinculacionComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TipoVinculacionRoutingModule { }
