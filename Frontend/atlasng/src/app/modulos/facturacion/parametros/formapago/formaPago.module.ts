import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { FormaPagoRoutingModule } from './formaPago.routing';

import { FormaPagoComponent } from './componentes/formaPago.component';
import { LovCuentasContablesModule } from 'app/modulos/contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, FormaPagoRoutingModule, LovCuentasContablesModule],
    declarations: [FormaPagoComponent]
})
export class FormaPagoModule { }
