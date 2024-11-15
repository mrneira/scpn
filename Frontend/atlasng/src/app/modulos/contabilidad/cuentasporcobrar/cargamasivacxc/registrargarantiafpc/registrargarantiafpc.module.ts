import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RegistrarGarantiaFPCRoutingModule } from './registrargarantiafpc.routing';

import { RegistrarGarantiaFPCComponent } from './componentes/registrargarantiafpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasContablesModule } from '../../../lov/cuentascontables/lov.cuentasContables.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
    imports: [SharedModule, RegistrarGarantiaFPCRoutingModule, LovClientesModule, LovCuentasContablesModule, JasperModule ],
    declarations: [RegistrarGarantiaFPCComponent]
})
export class RegistrarGarantiaFPCModule { }
