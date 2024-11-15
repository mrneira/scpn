import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoMigradasJudicialesRoutingModule } from './pagomigradasjudiciales.routing';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { PagoMigradasJudicialesComponent } from './componentes/pagomigradasjudiciales.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';

@NgModule({
  imports: [SharedModule, PagoMigradasJudicialesRoutingModule, LovProveedoresModule, CabeceraModule, DetalleModule ],
  declarations: [ PagoMigradasJudicialesComponent]
})
export class PagoMigradasJudicialesModule { }
