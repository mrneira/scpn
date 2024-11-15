import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { KardexFechaReporteRoutingModule } from './kardexFechaReporte.routing';
import { KardexFechaReporteComponent } from './componentes/kardexFechaReporte.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../../lov/productos/lov.productos.module';
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
@NgModule({
  imports: [SharedModule, KardexFechaReporteRoutingModule, JasperModule, LovProductosModule, LovCuentasContablesModule ],
  declarations: [KardexFechaReporteComponent]
})
export class KardexFechaReporteModule { }
