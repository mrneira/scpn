import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarNotaCreditoFPCComponent } from './componentes/registrarnotacreditofpc.component';

const routes: Routes = [
    {
        path: '', component: RegistrarNotaCreditoFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistrarNotaCreditoFPCRoutingModule { }
