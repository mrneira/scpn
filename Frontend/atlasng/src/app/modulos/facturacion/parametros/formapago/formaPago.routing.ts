import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormaPagoComponent } from './componentes/formaPago.component';

const routes: Routes = [
    {
        path: '', component: FormaPagoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormaPagoRoutingModule { }
