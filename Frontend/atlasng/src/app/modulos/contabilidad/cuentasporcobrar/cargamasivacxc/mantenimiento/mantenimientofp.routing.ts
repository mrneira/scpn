import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoFPComponent } from './componentes/mantenimientofp.component';

const routes: Routes = [
    {
        path: '', component: MantenimientoFPComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MantenimientoFPRoutingModule { }
