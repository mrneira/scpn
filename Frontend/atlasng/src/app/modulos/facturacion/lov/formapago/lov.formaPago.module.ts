import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { LovFormaPagoRoutingModule } from './lov.formaPago.routing';

import { LovFormaPagoComponent } from './componentes/lov.formaPago.component';


@NgModule({
    imports: [SharedModule, LovFormaPagoRoutingModule],
    declarations: [LovFormaPagoComponent],
    exports: [LovFormaPagoComponent]
})
export class LovFormaPagoModule { }

