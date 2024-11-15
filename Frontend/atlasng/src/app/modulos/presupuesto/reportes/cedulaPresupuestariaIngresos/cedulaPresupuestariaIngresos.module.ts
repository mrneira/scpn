import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { CedulaPresupuestariaIngresosComponent } from './componentes/cedulaPresupuestariaIngresos.component';
import { CedulaPresupuestariaIngresosRoutingModule } from './cedulaPresupuestariaIngresos.routing';
import { LovPartidaIngresoModule } from '../../lov/partidaingreso/lov.partidaingreso.module';


@NgModule({
  imports: [SharedModule, CedulaPresupuestariaIngresosRoutingModule, JasperModule, LovPartidaIngresoModule],
  declarations: [CedulaPresupuestariaIngresosComponent]
})
export class CedulaPresupuestariaIngresosModule { }
