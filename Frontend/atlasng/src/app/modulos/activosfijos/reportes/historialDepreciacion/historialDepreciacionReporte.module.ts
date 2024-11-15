import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistorialDepreciacionReporteRoutingModule } from './historialDepreciacionReporte.routing';
import { HistorialDepreciacionReporteComponent } from './componentes/historialDepreciacionReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, HistorialDepreciacionReporteRoutingModule, JasperModule, LovProductosModule ],
  declarations: [HistorialDepreciacionReporteComponent]
})
export class HistorialDepreciacionReporteModule { }
