import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldoVacacionesRoutingModule } from './saldoVacaciones.routing';
import { SaldoVacacionesComponent } from './componentes/saldoVacaciones.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, SaldoVacacionesRoutingModule, JasperModule, LovFuncionariosModule,SpinnerModule],
  declarations: [SaldoVacacionesComponent]
})
export class SaldoVacacionesModule { }
