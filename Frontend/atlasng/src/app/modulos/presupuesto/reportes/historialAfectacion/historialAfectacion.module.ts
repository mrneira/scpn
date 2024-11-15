import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { HistorialAfectacionRoutingModule } from './historialAfectacion.routing';
import { HistorialAfectacionComponent } from './componentes/historialAfectacion.component';

@NgModule({
  imports: [SharedModule, HistorialAfectacionRoutingModule, JasperModule],
  declarations: [HistorialAfectacionComponent]
})
export class HistorialAfectacionModule { }
