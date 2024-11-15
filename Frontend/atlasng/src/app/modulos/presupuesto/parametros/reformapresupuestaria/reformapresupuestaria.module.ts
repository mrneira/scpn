import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReformaPresupuestariaRoutingModule } from './reformapresupuestaria.routing';
import { ReformaPresupuestariaComponent } from './componentes/reformapresupuestaria.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';

@NgModule({
  imports: [SharedModule, ReformaPresupuestariaRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovPartidaGastoModule ],
  declarations: [ReformaPresupuestariaComponent]
})
export class ReformaPresupuestariaModule { }
