import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarDepositoFPCComponent } from './componentes/registrardepositofpc.component';

const routes: Routes = [
    {
        path: '', component: RegistrarDepositoFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistrarDepositoFPCRoutingModule { }
