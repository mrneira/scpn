import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaEgresoRoutingModule } from './consultaegreso.routing';
import { ConsultaEgresoComponent } from './componentes/consultaegreso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';

@NgModule({
  imports: [SharedModule, ConsultaEgresoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovEgresosModule],
  declarations: [ConsultaEgresoComponent]
})
export class ConsultaEgresoModule { }
