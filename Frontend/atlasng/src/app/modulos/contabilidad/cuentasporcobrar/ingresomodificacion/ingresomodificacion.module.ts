import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoModificacionRoutingModule } from './ingresomodificacion.routing';

import { IngresoModificacionComponent } from './componentes/ingresomodificacion.component';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';
import { LovCuentasPorCobrarModule } from '../../lov/cuentasporcobrar/lov.cuentasporcobrar.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';

@NgModule({
    imports: [SharedModule, IngresoModificacionRoutingModule, LovClientesModule, 
        LovCuentasPorCobrarModule, LovPlantillasComprobanteModule, JasperModule],
    declarations: [IngresoModificacionComponent]
})
export class IngresoModificacionModule { }
