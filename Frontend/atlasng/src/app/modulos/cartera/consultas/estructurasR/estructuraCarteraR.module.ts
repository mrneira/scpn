import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstructuraCarteraRRoutingModule } from './estructuraCarteraR.routing';
import { EstructuraCarteraRComponent } from './componentes/estructuraCarteraR.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, EstructuraCarteraRRoutingModule, JasperModule],
  declarations: [EstructuraCarteraRComponent]
})
export class EstructuraCarteraRModule { }
