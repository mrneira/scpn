import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoModificacionComponent } from './componentes/ingresomodificacion.component';

const routes: Routes = [
    {
        path: '', component: IngresoModificacionComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IngresoModificacionRoutingModule { }
