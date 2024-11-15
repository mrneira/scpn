import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ResumenDescuentosRoutingModule } from './resumenDescuentos.routing';
import { ResumenDescuentosComponent } from './componentes/resumenDescuentos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ResumenDescuentosRoutingModule, JasperModule],
  declarations: [ResumenDescuentosComponent]
})
export class ResumenDescuentosModule { }
