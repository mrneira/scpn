import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RegistrarDepositoFPCRoutingModule } from './registrardepositofpc.routing';

import { RegistrarDepositoFPCComponent } from './componentes/registrardepositofpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';

@NgModule({
    imports: [SharedModule, RegistrarDepositoFPCRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule],
    declarations: [RegistrarDepositoFPCComponent]
})
export class RegistrarDepositoFPCModule { }
