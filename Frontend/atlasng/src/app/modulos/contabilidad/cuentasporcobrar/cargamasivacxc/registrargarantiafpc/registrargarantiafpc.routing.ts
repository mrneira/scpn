import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarGarantiaFPCComponent } from './componentes/registrargarantiafpc.component';

const routes: Routes = [
    {
        path: '', component: RegistrarGarantiaFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistrarGarantiaFPCRoutingModule { }
