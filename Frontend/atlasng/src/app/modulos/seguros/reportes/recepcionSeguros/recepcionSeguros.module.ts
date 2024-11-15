import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RecepcionSegurosRoutingModule } from './recepcionSeguros.routing';
import { RecepcionSegurosComponent } from './componentes/recepcionSeguros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, RecepcionSegurosRoutingModule, JasperModule],
  declarations: [RecepcionSegurosComponent]

})
export class RecepcionSegurosModule { }
