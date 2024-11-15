import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RegistrarNotaCreditoFPCRoutingModule } from './registrarnotacreditofpc.routing';

import { RegistrarNotaCreditoFPCComponent } from './componentes/registrarnotacreditofpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';

@NgModule({
    imports: [SharedModule, RegistrarNotaCreditoFPCRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule],
    declarations: [RegistrarNotaCreditoFPCComponent]
})
export class RegistrarNotaCreditoFPCModule { }
