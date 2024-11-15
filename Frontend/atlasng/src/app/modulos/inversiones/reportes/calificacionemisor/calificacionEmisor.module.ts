import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalificacionEmisorRoutingModule } from './calificacionEmisor.routing';
import { CalificacionEmisorComponent } from './componentes/calificacionEmisor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CalificacionEmisorRoutingModule, JasperModule, SpinnerModule ],
  declarations: [CalificacionEmisorComponent]
})
export class CalificacionEmisorModule { }
