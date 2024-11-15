import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SegurosDescuentosRoutingModule } from './segurosDescuentos.routing';
import { SegurosDescuentosComponent } from './componentes/segurosDescuentos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, SegurosDescuentosRoutingModule, JasperModule],
  declarations: [SegurosDescuentosComponent]
})
export class SegurosDescuentosModule { }
