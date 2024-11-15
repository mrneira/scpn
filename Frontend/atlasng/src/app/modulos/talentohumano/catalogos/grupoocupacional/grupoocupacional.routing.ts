import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GrupoOcupacionalComponent } from './componentes/grupoocupacional.component';

const routes: Routes = [
    {
        path: '', component: GrupoOcupacionalComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GrupoOcupacionalRoutingModule { }
