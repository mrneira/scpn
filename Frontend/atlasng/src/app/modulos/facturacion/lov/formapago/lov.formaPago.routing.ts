import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovFormaPagoComponent } from './componentes/lov.formaPago.component';

const routes: Routes = [
    {
        path: '', component: LovFormaPagoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LovFormaPagoRoutingModule { }
