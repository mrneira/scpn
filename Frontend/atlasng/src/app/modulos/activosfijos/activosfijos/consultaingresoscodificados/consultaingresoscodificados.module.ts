import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaIngresosCodificadosRoutingModule } from './consultaingresoscodificados.routing';

import { ConsultaIngresosCodificadosComponent } from './componentes/consultaingresoscodificados.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovIngresosModule } from '../../lov/ingresos/lov.ingresos.module';


@NgModule({
  imports: [SharedModule, ConsultaIngresosCodificadosRoutingModule,JasperModule, LovIngresosModule ],
  declarations: [ConsultaIngresosCodificadosComponent]
})
export class ConsultaIngresosCodificadosModule { }
