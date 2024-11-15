import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RegistrarDepositoRoutingModule } from './registrardeposito.routing';

import { RegistrarDepositoComponent } from './componentes/registrardeposito.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovCuentasContablesModule } from '../../../lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, RegistrarDepositoRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule, LovCuentasContablesModule],
    declarations: [RegistrarDepositoComponent]
})
export class RegistrarDepositoModule { }
