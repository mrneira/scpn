import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ContabilizarFPRoutingModule } from './contabilizarfp.routing';

import { ContabilizarFPComponent } from './componentes/contabilizarfp.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovCuentasContablesModule } from '../../../lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, ContabilizarFPRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule, LovCuentasContablesModule],
    declarations: [ContabilizarFPComponent]
})
export class ContabilizarFPModule { }
