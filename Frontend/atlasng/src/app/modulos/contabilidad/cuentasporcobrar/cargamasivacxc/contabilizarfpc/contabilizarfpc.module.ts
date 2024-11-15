import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ContabilizarFPCRoutingModule } from './contabilizarfpc.routing';

import { ContabilizarFPCComponent } from './componentes/contabilizarfpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';

@NgModule({
    imports: [SharedModule, ContabilizarFPCRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule],
    declarations: [ContabilizarFPCComponent]
})
export class ContabilizarFPCModule { }
