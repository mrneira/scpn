import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolverGarantiaFPCComponent } from './componentes/devolvergarantiafpc.component';

const routes: Routes = [
    {
        path: '', component: DevolverGarantiaFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DevolverGarantiaFPCRoutingModule { }
