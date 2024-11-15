import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ResumenEmisorComponent } from './componentes/resumenEmisor.component';
import { ResumenEmisorRoutingModule } from './resumenEmisor.routing';

@NgModule({
  imports: [SharedModule, ResumenEmisorRoutingModule, JasperModule],
  declarations: [ResumenEmisorComponent]
})
export class ResumenEmisorModule { }
