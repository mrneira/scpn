import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { MantenimientoFPRoutingModule } from './mantenimientofp.routing';

import { MantenimientoFPComponent } from './componentes/mantenimientofp.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovCuentasContablesModule } from '../../../lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, MantenimientoFPRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule, LovCuentasContablesModule],
    declarations: [MantenimientoFPComponent]
})
export class MantenimientoFPModule { }
