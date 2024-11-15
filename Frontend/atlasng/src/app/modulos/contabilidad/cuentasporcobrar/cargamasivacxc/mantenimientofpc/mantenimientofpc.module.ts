import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { MantenimientoFPCRoutingModule } from './mantenimientofpc.routing';

import { MantenimientoFPCComponent } from './componentes/mantenimientofpc.component';
import { LovClientesModule } from '../../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../../lov/plantillascomprobante/lov.plantillasComprobante.module';

@NgModule({
    imports: [SharedModule, MantenimientoFPCRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule],
    declarations: [MantenimientoFPCComponent]
})
export class MantenimientoFPCModule { }
