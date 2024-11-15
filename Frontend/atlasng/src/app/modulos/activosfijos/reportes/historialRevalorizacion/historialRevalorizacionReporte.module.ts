import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistorialRevalorizacionReporteRoutingModule } from './historialRevalorizacionReporte.routing';
import { HistorialRevalorizacionReporteComponent } from './componentes/historialRevalorizacionReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';

@NgModule({
  imports: [SharedModule, HistorialRevalorizacionReporteRoutingModule, JasperModule, LovProductosModule ],
  declarations: [HistorialRevalorizacionReporteComponent]
})
export class HistorialRevalorizacionReporteModule { }
