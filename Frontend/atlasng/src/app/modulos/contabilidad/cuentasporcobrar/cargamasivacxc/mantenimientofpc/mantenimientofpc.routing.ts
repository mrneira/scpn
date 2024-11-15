import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoFPCComponent } from './componentes/mantenimientofpc.component';

const routes: Routes = [
    {
        path: '', component: MantenimientoFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MantenimientoFPCRoutingModule { }
