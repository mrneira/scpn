import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RecaudacionCobranzasRoutingModule } from './recaudacionCobranzas.routing';
import { RecaudacionCobranzasComponent } from './componentes/recaudacionCobranzas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, RecaudacionCobranzasRoutingModule, JasperModule],
  declarations: [RecaudacionCobranzasComponent]
})
export class RecaudacionCobranzasModule { }