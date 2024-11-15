import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EgresoRoutingModule } from './egreso.routing';
import { EgresoComponent } from './componentes/egreso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovEgresosModule } from '../../lov/egresos/lov.egresos.module';

import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, EgresoRoutingModule, CabeceraModule, DetalleModule, 
    JasperModule, LovEgresosModule, LovFuncionariosModule],
  declarations: [EgresoComponent]
})
export class EgresoModule { }
