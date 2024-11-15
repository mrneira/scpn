import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarDepositoComponent } from './componentes/registrardeposito.component';

const routes: Routes = [
    {
        path: '', component: RegistrarDepositoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistrarDepositoRoutingModule { }
